import { store } from '../redux/store';
import {backendIP, createRequest} from './requestGenerator';
import { createRefreshUserRequest } from './userRequests';

export function getImageLink(imageId: string) {
  return `${backendIP}/api/image/get/${imageId}`
}

export function createPostImageRequest(image: File, newToken?: string): Promise<Response> {
  const formData = new FormData()
  formData.append('image', image)

  const token = newToken ? newToken : store.getState().auth.token

  return fetch(
    `${backendIP}/api/image`,
    {
      method: 'POST',
      headers: {
        ...token && {'Authorization': `Bearer ${token}`},
      },
      body: formData,
    })
    .then(async (res) => {
      if (res.status === 500) {
        console.log('Server Error')
      }
      if (res.status === 401 || res.status === 403) {
        console.log('Unauthorized or Forbidden')
        const refreshedToken = await createRefreshUserRequest()
        if(refreshedToken) {
          return createPostImageRequest(image, refreshedToken)
        }
      }
      return res
    })
}

export function createDeleteImageRequest(imageId: string) {
  return createRequest('DELETE', `api/image`, undefined, imageId, true)
}



