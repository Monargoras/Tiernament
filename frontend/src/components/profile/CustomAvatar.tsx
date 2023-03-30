import React from 'react';
import { Avatar } from '@mui/material';
import { getImageLink } from '../../apiRequests/imageRequests';

interface UserAvatarProps {
  userName: string,
  imageId: string,
  size?: {height: number, width: number},
}

export default function CustomAvatar(props: UserAvatarProps) {

  if(props.imageId != '') {
    return (
      <Avatar
        alt={props.userName}
        src={getImageLink(props.imageId)}
        sx={props.size && {height: props.size.height, width: props.size.width}}
      />
    )
  } else {
    return (
      <Avatar sx={props.size && {height: props.size.height, width: props.size.width}}>
        {props.userName[0]}
      </Avatar>
    )
  }
}