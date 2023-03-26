import { backendIP, createRequest } from './requestGenerator';
import { store } from '../redux/store';
import { credError, login, logout, updateUser } from '../redux/authSlice';
import { sha256 } from 'js-sha256';
import { UserType } from '../util/types';


export function createGetUserRequest(username: string) {
  return createRequest('GET', 'api/user/get', undefined, username)
}

export function createPatchUserRequest(data: UserType) {
  const dispatch = store.dispatch

  return createRequest('PATCH', 'api/user', data)
    .then((res) => {
      if(res.ok)
        return res.json()
          .then((data) => {
            if(res.ok) {
              dispatch(updateUser(data))
              return data
            }
          })
    })
}

export function createLoginUserRequest(username: string, password: string) {
  const dispatch = store.dispatch

  fetch(
    `${backendIP}/api/user/login`,
    {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: username, password: sha256.update(password).hex() })
    })
    .then((res) => {
      if(res.status === 500) {
        console.log('Server Error')
        return
      }
      if(res.status === 403) {
        console.log('Forbidden')
        return
      }
      if(res) {
        res.json().then((data) => {
          if(res.ok) {
            dispatch(login({ user: data.user, token: data.token }))
          }
          else
            dispatch(credError(data.message))
        })
      }
    })
}

export function createRegisterUserRequest(username: string, password: string) {
  const dispatch = store.dispatch

  fetch(
    `${backendIP}/api/user/create`,
    {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: username, password: sha256.update(password).hex() })
    })
    .then((res) => {
      if(res.status === 500) {
        console.log('Server Error')
        return
      }
      if(res.status === 403) {
        dispatch(credError('bErrorUserExists'))
        return
      }
      if(res.ok)
        createLoginUserRequest(username, password)
      else
        dispatch(credError('bErrorUserExists'))
    })
}

export const createRefreshUserRequest = () => {
  const dispatch = store.dispatch

  fetch(
    `${backendIP}/api/user/refresh`,
    {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    })
    .then((res) => {
      if(res.status === 500) {
        console.log('Server Error')
        return
      }
      if(res.status === 401) {
        console.log('Unauthorized')
        return
      }
      if(res.status === 403) {
        console.log('Forbidden')
        return
      }
      if(res) {
        res.json().then((data) => {
          if(res.ok)
            dispatch(login({ user: data.user, token: data.token }))
          else
            dispatch(credError(data))
        })
      }
    })
}

export const createLogoutUserRequest = () => {
  const dispatch = store.dispatch

  fetch(
    `${backendIP}/api/user/logout`,
    {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    })
    .then((res) => {
      if(res.status === 500) {
        console.log('Server Error')
      }
      if(res.status === 401) {
        console.log('Unauthorized')
      }
      if(res.status === 403) {
        console.log('Forbidden')
      }
      dispatch(logout())
    })
}