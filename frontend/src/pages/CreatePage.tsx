import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { createDeleteImageRequest, createPostImageRequest } from '../apiRequests/imageRequests';
import ErrorSnackbar from '../components/general/ErrorSnackbar';
import { AddAPhoto, DeleteForever } from '@mui/icons-material';
import TiernamentCard from '../components/tiernament/TiernamentCard';

export default function CreatePage() {

  const navigate = useNavigate()
  const authState = useAppSelector(state => state.auth)
  const { t } = useTranslation()

  const [tiernamentName, setTiernamentName] = React.useState('')
  const [tiernamentDescription, setTiernamentDescription] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [imageId, setImageId] = React.useState<string | undefined>(undefined)

  const styles = {
    paper: {
      padding: '10px',
    },
    textField: {
      marginX: '5px',
    },
    flexRow: {
      display: 'flex',
      flexDirection: 'row',
    },
    flexColumn: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  }

  React.useEffect(() => {
    if (!authState.user) {
      navigate('/login', { state: { from: '/tiernament/create' } })
    }
  }, [])

  const handleRemoveImage = () => {
    if(imageId) {
      createDeleteImageRequest(imageId).then((res) => {
        if(res.ok) {
          setImageId(undefined)
        }
      })
    }
  }

  const handleImageChange = (imageFile: File) => {
    handleRemoveImage()
    if(imageFile) {
      createPostImageRequest(imageFile)
        .then((res) => {
          if (res.ok) {
            res.json().then((data) => {
              setImageId(data.id)
            })
          } else {
            if (res.status === 413) {
              res.json().then((data) => {
                setErrorMessage(data.message)
                setImageId(undefined)
              })
            }
          }
        })
    }
  }

  return (
    <Box>
      <Grid container spacing={2} alignItems={'center'}>
        <Grid item xs={12} sm={12} md={8} lg={8} xl={9}>
          <Paper sx={styles.paper}>
            <Typography variant={'h6'} sx={{mb: '10px', ml: '5px'}}>
              {t('createTiernamentHeader')}
            </Typography>
            <Box sx={styles.flexRow}>
              <Box sx={styles.flexColumn}>
                <TextField
                  id={'tiernamentName'}
                  label={t('tiernamentName')}
                  variant={'outlined'}
                  sx={styles.textField}
                  value={tiernamentName}
                  onChange={(event) => setTiernamentName(event.target.value)}
                />
                <Button sx={{mx: 'auto', mt: '10px', width:'95%'}} component={'label'} variant={'contained'}>
                  {t('changeImage')}
                  <AddAPhoto fontSize={'large'} color={'secondary'} sx={{ml: '5px'}} />
                  <input
                    type={'file'}
                    accept={'image/*'}
                    multiple={false}
                    hidden
                    onChange={
                      event => {
                        if(event.target.files) {
                          handleImageChange(event.target.files![0])
                        }
                      }
                    }
                  />
                </Button>
                <Button sx={{mx: 'auto', mt: '10px', width:'95%'}} onClick={handleRemoveImage}>
                  {t('removeImage')}
                  <DeleteForever fontSize={'large'} color={'secondary'} sx={{ml: '5px'}} />
                </Button>
              </Box>
              <TextField
                id={'tiernamentDescription'}
                label={t('tiernamentDescription')}
                variant={'outlined'}
                sx={styles.textField}
                value={tiernamentDescription}
                onChange={(event) => setTiernamentDescription(event.target.value)}
                multiline
                maxRows={10}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={3}>
          <Box sx={styles.flexColumn}>
            <Typography
              variant={'h6'}
              sx={{mb: '5px'}}
              color={'secondary'}
            >
              {t('preview')}
            </Typography>
            <TiernamentCard
              tiernament={{
                tiernamentId: '1',
                authorId: authState.user?.userId || '',
                authorDisplayName: authState.user?.displayName || '',
                authorAvatarId: authState.user?.avatarId || '',
                name: tiernamentName,
                imageId: imageId || '',
                description: tiernamentDescription,
                date: new Date(),
              }}
              dummy
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{...styles.paper, marginRight: 0, marginTop: '10px'}}>
            <Typography variant={'h6'} sx={{mb: '10px', ml: '5px'}}>
              {t('createTiernamentEntries')}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <ErrorSnackbar errorMessage={errorMessage} setErrorMessage={setErrorMessage}/>
    </Box>
  )
}