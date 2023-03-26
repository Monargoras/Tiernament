import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ErrorSnackbarProps {
  errorMessage: string
  setErrorMessage: (message: string) => void
}

export default function ErrorSnackbar(props: ErrorSnackbarProps) {

  const { t } = useTranslation()

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    props.setErrorMessage('')
  }

  return (
    <Snackbar open={props.errorMessage != ''} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={'error'} sx={{width: '100%'}}>
        {t(props.errorMessage)}
      </Alert>
    </Snackbar>
  )
}