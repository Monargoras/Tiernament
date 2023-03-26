import React from 'react';
import { UserType } from '../../util/types';
import { useAppSelector } from '../../redux/hooks';
import { useTranslation } from 'react-i18next';
import { createPatchUserRequest } from '../../apiRequests/userRequests';
import { Badge, Box, IconButton, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { Check, Edit, Undo } from '@mui/icons-material';
import { generalStyles } from '../../util/styles';
import { createPostImageRequest } from '../../apiRequests/imageRequests';
import UserAvatar from './UserAvatar';
import ErrorSnackbar from '../general/ErrorSnackbar';

interface ProfileHeaderProps {
  user: UserType
  privateView: boolean
  setUserState: (user: UserType) => void
}

export default function ProfileHeader(props: ProfileHeaderProps) {

  const authState = useAppSelector(state => state.auth)
  const { t } = useTranslation()
  const [name, setName] = React.useState(props.user.displayName)
  const [editName, setEditName] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')

  const handleImageChange = (imageFile: File) => {
    createPostImageRequest(imageFile)
      .then((res) => {
        if(res.ok) {
          res.json().then((data) => {
            const newUser = {...props.user}
            newUser.avatarId = data.id
            createPatchUserRequest(newUser).then(data => {
              if(data) {
                props.setUserState(data)
              }
            })
          })
        } else {
          if(res.status === 413) {
            res.json().then((data) => {
              setErrorMessage(data.message)
            })
          }
        }
      })
  }

  const switchNameEditMode = () => {
    setEditName((prev) => {
      if(prev) {
        setName(props.user.displayName)
      }
      return !prev
    })
  }

  const handleNameUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleNameChangeSubmit = () => {
    if(authState && authState.user) {
      const newUser = {...authState.user}
      newUser.displayName = name
      createPatchUserRequest(newUser).then(data => {
        if(data) {
          props.setUserState(data)
          setEditName(false)
          return
        }
      })
      setEditName(false)
    }
  }

  return (
    <Box>
      <Paper sx={{padding: '20px', paddingY: '25px', margin: 'auto'}} elevation={4}>
        {
          props.privateView &&
            <Box sx={generalStyles.flexWrapBox}>
                <Badge
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Edit fontSize={'small'} color={'primary'}/>
                    }
                >
                    <Tooltip title={t('changeImage')}>
                        <IconButton sx={{p: 0}} component={'label'}>
                            <UserAvatar userName={props.user.displayName} avatarId={props.user.avatarId}/>
                            <input
                                type={'file'}
                                accept={'image/*'}
                                multiple={false}
                                hidden
                                onChange={
                                  event => {
                                    if(event.target.files) {
                                      handleImageChange(event.target.files![0])
                                    }
                                  }
                                }
                            />
                        </IconButton>
                    </Tooltip>
                </Badge>
              {
                !editName &&
                  <Badge
                      anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                      badgeContent={
                        <Edit fontSize={'small'} color={'primary'}/>
                      }
                  >
                      <Box onClick={switchNameEditMode} sx={{cursor: 'pointer', marginLeft: '20px'}}>
                          <Tooltip title={t('editName')}>
                              <Typography variant={'h4'}>
                                {props.user.displayName}
                              </Typography>
                          </Tooltip>
                      </Box>
                  </Badge>
              }
              {
                editName &&
                  <Box>
                      <TextField
                          variant={'standard'}
                          value={name}
                          onChange={handleNameUpdate}
                          sx={{marginLeft: '20px'}}
                          onKeyDown={
                            event => {
                              if (event.key === "Enter") {
                                handleNameChangeSubmit()
                              }
                            }}
                      />
                      <IconButton onClick={handleNameChangeSubmit}>
                          <Check color={'primary'}/>
                      </IconButton>
                      <IconButton onClick={switchNameEditMode}>
                          <Undo color={'secondary'}/>
                      </IconButton>
                  </Box>
              }
            </Box>
        }
        {
          !props.privateView &&
            <Box sx={generalStyles.flexWrapBox}>
                <UserAvatar userName={props.user.displayName} avatarId={props.user.avatarId}/>
                <Typography variant={'h4'} sx={{marginLeft: '20px'}}>
                  {props.user.displayName}
                </Typography>
            </Box>
        }
      </Paper>
      <ErrorSnackbar errorMessage={errorMessage} setErrorMessage={setErrorMessage}/>
    </Box>
  )
}