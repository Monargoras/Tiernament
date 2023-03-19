import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError()
  const isRoutErrorRes = isRouteErrorResponse(error)

  return (
    <div id="error-page" style={{textAlign: 'center'}}>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      { isRoutErrorRes &&
          <p>
              <i>{error.statusText || error.data.message}</i>
          </p>
      }
    </div>
  );
}