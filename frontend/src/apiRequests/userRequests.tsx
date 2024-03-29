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

  return createRequest('PATCH', 'api/user', data, undefined, true)
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
      if(res.status === 409) {
        dispatch(credError('bErrorUserExists'))
        return
      }
      if(res.ok)
        createLoginUserRequest(username, password)
    })
}

export const createRefreshUserRequest = async (): Promise<string | undefined> => {
  const dispatch = store.dispatch

  return fetch(
    `${backendIP}/api/user/refresh`,
    {
      method: 'POST',
      credentials: 'include',
    })
    .then((res) => {
      if(res.status === 401) {
        console.log('Unauthorized')
        return undefined
      }
      if(res.status === 403) {
        console.log('Forbidden')
        return undefined
      }
      if(res.status === 500) {
        console.log('Server Error')
        return undefined
      }
      if(res) {
        return res.json().then((data) => {
          if(res.ok) {
            dispatch(login({user: data.user, token: data.token}))
            return data.token
          }
          else
            dispatch(credError(data.message))
          return undefined
        })
      }
    })
}

export const createLogoutUserRequest = (newToken?: string) => {
  const dispatch = store.dispatch
  const token = newToken ? newToken : store.getState().auth.token

  fetch(
    `${backendIP}/api/user/logout`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
    })
    .then(async (res) => {
      if (res.status === 500) {
        console.log('Server Error')
      }
      if (res.status === 401 || res.status === 403) {
        console.log('Unauthorized or Forbidden')
        const refreshedToken = await createRefreshUserRequest()
        if (refreshedToken) {
          return createLogoutUserRequest(refreshedToken)
        }
      }
      if (res.ok) {
        dispatch(logout())
      }
    })
}