import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { createGetUserRequest, createPatchUserRequest } from '../apiRequests/userRequests';
import { UserType } from '../util/types';
import {Avatar, Badge, Box, IconButton, Paper, TextField, Tooltip, Typography} from '@mui/material';
import { generalStyles } from '../util/styles';
import { backendIP } from '../apiRequests/requestGenerator';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../redux/hooks';
import { Edit, Check, Undo } from '@mui/icons-material';


export async function loader(params: { username: string }) {
  const res = await createGetUserRequest(params.username)
  return await res.json()
}

export default function ProfilePage() {

  const [userState, setUserState] = React.useState(useLoaderData() as UserType)
  const { t } = useTranslation()
  const authState = useAppSelector(state => state.auth)
  const [name, setName] = React.useState(userState.displayName)
  const [editName, setEditName] = React.useState(false)

  const handleImageChange = () => {
    console.log('Change image')
  }

  const switchNameEditMode = () => {
    setEditName((prev) => {
      if(prev) {
        setName(userState.displayName)
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
      createPatchUserRequest(newUser).then(res => {
        if(res.ok) {
          setUserState(newUser)
          setEditName(false)
          return
        }
      })
      setEditName(false)
    }
  }

  return (
    <Box sx={generalStyles.backgroundContainer}>
      <Paper sx={{padding: '30px', paddingY: '35px', margin: 'auto'}} elevation={4}>
        {
          authState.user && authState.user.userId === userState.userId &&
            <Box sx={generalStyles.flexWrapBox}>
                <Badge
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Edit fontSize={'small'} color={'primary'}/>
                    }
                >
                    <Tooltip title={t('changeImage')}>
                        <IconButton onClick={handleImageChange} sx={{p: 0}}>
                            <Avatar alt={userState.name} src={`${backendIP}/api/image/get/${userState.avatarId}`}/>
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
                                {userState.displayName}
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
          (!authState.user || authState.user.userId !== userState.userId) &&
            <Box sx={generalStyles.flexWrapBox}>
                <Avatar alt={userState.displayName} src={`${backendIP}/api/image/get/${userState.avatarId}`}/>
                <Typography variant={'h4'} sx={{marginLeft: '20px'}}>
                  {userState.displayName}
                </Typography>
            </Box>
        }
      </Paper>
    </Box>
  )
}