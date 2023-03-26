import { store } from '../redux/store';
import { backendIP } from './requestGenerator';

export function createPostImageRequest(image: File) {
  const formData = new FormData()
  formData.append('image', image)

  return fetch(
    `${backendIP}/api/image`,
    {
      method: 'POST',
      headers: {
        ...store.getState().auth.token && {'Authorization': `Bearer ${store.getState().auth.token}`},
      },
      body: formData,
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
      return res
    })
}