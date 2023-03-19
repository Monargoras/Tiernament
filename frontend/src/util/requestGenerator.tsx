export const backendIP = 'http://localhost:8080'

export const createRequest = (method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', apiEndpoint: string, body?: Object, pathArgument?: String) => {
  const argument = pathArgument ? `/${pathArgument}` : ''

  return fetch(
    `${backendIP}/${apiEndpoint}${argument}`,
    {
      method: method,
      mode: 'cors',
      headers: {
        ...body && {'Content-Type': 'application/json'},
      },
      ...body && {
        body: JSON.stringify(body),
      },
    })
    .then((res) => {
      if(res.status === 500) {
        alert('Server Error')
      }
      if(res.status === 401) {
        alert('Unauthorized')
      }
      return res
    })
}