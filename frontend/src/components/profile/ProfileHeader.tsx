import React from 'react';
import { UserType } from '../../util/types';
import { useAppSelector } from '../../redux/hooks';
import { useTranslation } from 'react-i18next';
import { createPatchUserRequest } from '../../apiRequests/userRequests';
import { Avatar, Badge, Box, IconButton, Paper, TextField, Tooltip, Typography } from '@mui/material';
import { Check, Edit, Undo } from '@mui/icons-material';
import { generalStyles } from '../../util/styles';
import { backendIP } from '../../apiRequests/requestGenerator';

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

  const handleImageChange = () => {
    console.log('Change image')
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
                        <IconButton onClick={handleImageChange} sx={{p: 0}}>
                            <Avatar alt={props.user.name} src={`${backendIP}/api/image/get/${props.user.avatarId}`}/>
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
                <Avatar alt={props.user.displayName} src={`${backendIP}/api/image/get/${props.user.avatarId}`}/>
                <Typography variant={'h4'} sx={{marginLeft: '20px'}}>
                  {props.user.displayName}
                </Typography>
            </Box>
        }
      </Paper>
    </Box>
  )
}