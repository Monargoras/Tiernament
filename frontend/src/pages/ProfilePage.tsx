import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { createGetUserRequest } from '../apiRequests/userRequests';
import { TiernamentTitleType, UserType } from '../util/types';
import { Box } from '@mui/material';
import { useAppSelector } from '../redux/hooks';
import ProfileHeader from '../components/profile/ProfileHeader';
import { fetchTiernamentsByUsername } from '../apiRequests/tiernamentRequests';
import ProfileTiernamentList from '../components/profile/ProfileTiernamentList';


export async function loader(params: { username: string }): Promise<{user: UserType, tiernaments: TiernamentTitleType[]}> {
  const userRes = await createGetUserRequest(params.username)
  const user = await userRes.json()
  const tierRes = await fetchTiernamentsByUsername(params.username)
  const tiernaments = await tierRes.json()
  return { user, tiernaments }
}

export default function ProfilePage() {

  const { user, tiernaments } = useLoaderData() as {user: UserType, tiernaments: TiernamentTitleType[]}
  const [userState, setUserState] = React.useState(user)
  const authState = useAppSelector(state => state.auth)
  const privateView = authState.user != undefined && userState.userId == authState.user.userId

  React.useEffect(() => {
    setUserState(user)
  }, [user])

  return (
    <Box>
      <ProfileHeader user={userState} privateView={privateView} setUserState={setUserState} />
      <ProfileTiernamentList tiernaments={tiernaments} />
    </Box>
  )
}