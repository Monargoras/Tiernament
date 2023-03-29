import { store } from '../redux/store';
import { createRefreshUserRequest } from './userRequests';

export const backendIP = 'http://localhost:8080'

export const createRequest = (
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  apiEndpoint: string,
  body?: Object,
  pathArgument?: String,
  authorized: boolean = false,
  newToken?: string,
): Promise<Response> => {
  const argument = pathArgument ? `/${pathArgument}` : ''
  const token = newToken ? newToken : store.getState().auth.token

  return fetch(
    `${backendIP}/${apiEndpoint}${argument}`,
    {
      method: method,
      headers: {
        ...(authorized && token) && {'Authorization': `Bearer ${token}`},
        ...body && {'Content-Type': 'application/json'},
      },
      ...body && {
        body: JSON.stringify(body),
      },
    })
    .then(async (res) => {
      if (res.status === 500) {
        alert('Server Error')
      }
      if (res.status === 401 || res.status === 403) {
        console.log('Unauthorized or Forbidden')
        const refreshedToken = await createRefreshUserRequest()
        if(refreshedToken) {
          return createRequest(method, apiEndpoint, body, pathArgument, authorized, refreshedToken)
        }
      }
      return res
    })
}