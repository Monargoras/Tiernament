import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { createGetUserRequest } from '../apiRequests/userRequests';
import { UserType } from '../util/types';


export async function loader(params: { username: string }) {
  const res = await createGetUserRequest(params.username)
  return await res.json()
}

export default function ProfilePage() {
  const user = useLoaderData() as UserType;


  return (
    <>
      <h1>Profile Page</h1>
      <p>{user.name}</p>
    </>
  )
}