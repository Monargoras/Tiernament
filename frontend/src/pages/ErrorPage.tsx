import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Typography } from '@mui/material';

export default function ErrorPage() {
  const error = useRouteError()
  const isRoutErrorRes = isRouteErrorResponse(error)

  return (
    <div id={'error-page'} style={{textAlign: 'center'}}>
      <Typography variant={'h3'}>Oops!</Typography>
      <p>Sorry, an unexpected error has occurred.</p>
      { isRoutErrorRes &&
          <Typography variant={'body1'}>
            {error.statusText || error.data.message}
          </Typography>
      }
    </div>
  );
}