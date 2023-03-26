import React from 'react';
import { backendIP } from '../../apiRequests/requestGenerator';
import { Avatar } from '@mui/material';

interface UserAvatarProps {
  userName: string
  avatarId: string
}

export default function UserAvatar(props: UserAvatarProps) {

  if(props.avatarId != '') {
    return (
      <Avatar
        alt={props.userName}
        src={`${backendIP}/api/image/get/${props.avatarId}`}
      />
    )
  } else {
    return (
      <Avatar>
        {props.userName[0]}
      </Avatar>
    )
  }
}