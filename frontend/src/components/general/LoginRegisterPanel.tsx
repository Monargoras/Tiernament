import React from 'react';
import { Button, FormControl, Paper, TextField, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useTranslation } from 'react-i18next';
import { generalStyles } from '../../util/styles';
import { credError } from '../../redux/authSlice';
import { createLoginUserRequest, createRegisterUserRequest } from '../../apiRequests/userRequests';

export default function LoginRegisterPanel() {

  const authState = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const [mode, setMode] = React.useState<'login' | 'register'>('login')
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [repeatPassword, setRepeatPassword] = React.useState('')

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setPassword('')
    setRepeatPassword('')
    dispatch(credError(undefined))
  }

  const submit = () => {
    if(username.length === 0 || password.length === 0) {
      dispatch(credError('errorCredInvalid'))
      return
    } else if(mode === 'register' && password !== repeatPassword) {
      dispatch(credError('errorPassMatch'))
      return
    } else if(authState.error) {
      dispatch(credError(undefined))
    }
    if(mode === 'login') {
      createLoginUserRequest(username, password)
    } else {
      createRegisterUserRequest(username, password)
    }
  }

  return (
    <Paper sx={generalStyles.paper} elevation={4}>
      <Typography variant={'h5'} sx={{paddingBottom: 1}}>{t('appName')}</Typography>
      <FormControl>
        <TextField
          sx={generalStyles.textField}
          label={t('username')}
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={
            event => {
              if (event.key === "Enter") {
                submit()
              }
            }}
        />
        <TextField
          sx={generalStyles.textField}
          label={t('password')}
          type={'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={
            event => {
              if (event.key === "Enter") {
                submit()
              }
            }}
        />
        {
          mode === 'register' &&
            <TextField
                sx={generalStyles.textField}
                label={t('repeatPass')}
                type={'password'}
                value={repeatPassword}
                onChange={e => setRepeatPassword(e.target.value)}
                onKeyDown={
                  event => {
                    if (event.key === "Enter") {
                      submit()
                    }
                  }}
            />
        }
        {
          authState.error &&
            <Typography variant={'body2'} color={'error'}>{t(authState.error)}</Typography>
        }
        <Button
          sx={generalStyles.button}
          color={'primary'}
          variant={'contained'}
          onClick={() => submit()}
        >
          {mode === 'login' ? t('login') : t('createNewAccount')}
        </Button>
        <Button
          sx={generalStyles.button}
          color={'secondary'}
          variant={'text'}
          onClick={() => switchMode()}
        >
          {mode === 'register' ? t('back') : t('needAccount')}
        </Button>
      </FormControl>
    </Paper>
  );
}