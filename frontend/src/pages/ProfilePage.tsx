import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { createGetUserRequest } from '../apiRequests/userRequests';
import { UserType } from '../util/types';
import { Box } from '@mui/material';
import { generalStyles } from '../util/styles';
import { useAppSelector } from '../redux/hooks';
import ProfileHeader from '../components/profile/ProfileHeader';


export async function loader(params: { username: string }) {
  const res = await createGetUserRequest(params.username)
  return await res.json()
}

export default function ProfilePage() {

  const [userState, setUserState] = React.useState(useLoaderData() as UserType)
  const authState = useAppSelector(state => state.auth)
  const privateView = authState.user != undefined && userState.userId == authState.user.userId

  return (
    <Box sx={{...generalStyles.backgroundContainer, justifyContent: 'start'}}>
      <ProfileHeader user={userState} privateView={privateView} setUserState={setUserState} />
    </Box>
  )
}