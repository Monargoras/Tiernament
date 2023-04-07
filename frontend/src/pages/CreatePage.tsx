import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';

export default function CreatePage() {

  const navigate = useNavigate()
  const authState = useAppSelector(state => state.auth)

  React.useEffect(() => {
    if (!authState.user) {
      navigate('/login', { state: { from: '/tiernament/create' } })
    }
  })

  return (
    <div>
      CreatePage
    </div>
  )
}