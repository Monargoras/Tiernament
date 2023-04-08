import React from 'react';
import { useAppSelector } from '../../redux/hooks';
import { Box, Button, IconButton, Grid, Paper, TextField, Typography, Tooltip, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { createPostImageRequest } from '../../apiRequests/imageRequests';
import ErrorSnackbar from '../../components/general/ErrorSnackbar';
import { Add, AddAPhoto, DeleteForever } from '@mui/icons-material';
import TiernamentCard from '../../components/tiernament/TiernamentCard';
import { TiernamentEntryType } from '../../util/types';
import CustomAvatar from '../../components/profile/CustomAvatar';
import { v4 as uuidv4 } from 'uuid';

export default function Editor() {

  const authState = useAppSelector(state => state.auth)
  const { t } = useTranslation()

  const [tiernamentName, setTiernamentName] = React.useState('')
  const [tiernamentDescription, setTiernamentDescription] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [titleImage, setTitleImage] = React.useState<{image: File, url: string} | undefined>(undefined)
  const [entries, setEntries] = React.useState<TiernamentEntryType[]>([])
  const [entryImages, setEntryImages] = React.useState<{[key: string]: {image: File, url: string}}>({})
  const [entryName, setEntryName] = React.useState('')

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
    entryBox: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'primary.main',
      borderRadius: '5px',
      p: '5px',
      mr: '5px',
      mb: '5px',
    },
  }

  const handleRemoveImage = (entryId?: string) => {
    if(!entryId && titleImage) {
      setTitleImage(undefined)
    } else if(entryId && entryImages[entryId]) {
      const newEntryImages = {...entryImages}
      delete newEntryImages[entryId]
      setEntryImages(newEntryImages)
    }
  }

  const handleTitleImagePost = () => {
    if(titleImage?.image) {
      createPostImageRequest(titleImage.image)
        .then((res) => {
          if (res.ok) {
            // TODO handle success
          } else {
            if (res.status === 413) {
              res.json().then((data) => {
                setErrorMessage(data.message)
                handleRemoveImage()
              })
            }
          }
        })
    }
  }

  const handleImageChange = (imageFile: File) => {
    if(imageFile) {
      const imageUrl = URL.createObjectURL(imageFile)
      setTitleImage({image: imageFile, url: imageUrl})
    }
  }

  const handleAddEntry = () => {
    if(entryName) {
      setEntries([...entries, {entryId: uuidv4(), name: entryName, imageId: '', placementHistory: []}])
      setEntryName('')
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
                <Button sx={{mx: 'auto', mt: '10px', width:'95%'}} onClick={() => handleRemoveImage()}>
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
                imageId: titleImage?.url || '',
                description: tiernamentDescription,
                date: new Date(),
              }}
              dummy
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{...styles.paper, marginTop: '10px'}}>
            <Typography variant={'h6'} sx={{mb: '10px', ml: '5px'}}>
              {t('createTiernamentEntries', {count: entries.length})}
            </Typography>
            <Box sx={{...styles.flexRow}}>
              <TextField
                id={'entryName'}
                label={t('entryName')}
                variant={'outlined'}
                sx={styles.textField}
                value={entryName}
                onChange={(event) => {
                  setEntryName(event.target.value)
                }}
                onKeyDown={(event) => {
                  if(event.key === 'Enter') {
                    handleAddEntry()
                  }
                }}
              />
              <Tooltip title={t('addEntry')}>
                <IconButton onClick={handleAddEntry}>
                  <Add fontSize={'large'} color={'primary'} />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider sx={{my: '10px'}} />
            <Box sx={{...styles.flexRow, pl: '5px', flexWrap: 'wrap'}}>
              {
                entries.map((entry, index) => (
                  <Paper key={index} sx={styles.entryBox}>
                    <CustomAvatar userName={entry.name} imageId={entry.imageId} size={{width: 25, height: 25}} />
                    <TextField
                      id={`entryName${index}`}
                      variant={'standard'}
                      sx={styles.textField}
                      value={entry.name}
                      onChange={(event) => {
                        const newEntries = [...entries]
                        newEntries[index].name = event.target.value
                        setEntries(newEntries)
                      }}
                    />
                    <IconButton
                      onClick={() => {
                        const newEntries = [...entries]
                        newEntries.splice(index, 1)
                        setEntries(newEntries)
                      }}
                    >
                      <DeleteForever fontSize={'small'} color={'primary'} />
                    </IconButton>
                  </Paper>
                ))
              }
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <ErrorSnackbar errorMessage={errorMessage} setErrorMessage={setErrorMessage}/>
    </Box>
  )
}