import React from 'react';
import { useAppSelector } from '../../redux/hooks';
import { Box, Button, IconButton, Grid, Paper, TextField, Typography, Tooltip, Divider, Badge } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { createPostImageRequest } from '../../apiRequests/imageRequests';
import ErrorSnackbar from '../../components/general/ErrorSnackbar';
import { Add, AddAPhoto, DeleteForever, Edit } from '@mui/icons-material';
import TiernamentCard from '../../components/tiernament/TiernamentCard';
import { TiernamentDTO, TiernamentEntryType } from '../../util/types';
import CustomAvatar from '../../components/profile/CustomAvatar';
import { v4 as uuidv4 } from 'uuid';
import { createTiernamentRequest } from '../../apiRequests/tiernamentRequests';

export default function Editor() {

  const authState = useAppSelector(state => state.auth)
  const { t } = useTranslation()

  const [tiernamentName, setTiernamentName] = React.useState('')
  const [tiernamentDescription, setTiernamentDescription] = React.useState('')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [coverImage, setCoverImage] = React.useState<{image: File, url: string} | undefined>(undefined)
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
    if(!entryId && coverImage) {
      setCoverImage(undefined)
    } else if(entryId && entryImages[entryId]) {
      const newEntryImages = {...entryImages}
      delete newEntryImages[entryId]
      setEntryImages(newEntryImages)
      const newEntries = entries.map(entry => {
        if(entry.entryId === entryId) {
          return {...entry, imageId: ''}
        }
        return entry
      })
      setEntries(newEntries)
    }
  }

  const handleCoverImagePost = () => {
    if (coverImage?.image) {
      return createPostImageRequest(coverImage.image)
        .then((res) => {
          if (res.ok) {
            return res.json().then((data) => {
              return data.id satisfies string
            }) satisfies Promise<string>
          } else {
            if (res.status === 413) {
              res.json().then((data) => {
                setErrorMessage(data.message)
                handleRemoveImage()
              })
            }
            return ''
          }
        })
    } else {
      return ''
    }
  }

  const handleCreateTiernament = async () => {
    // upload cover image
    const coverImageId = await handleCoverImagePost()
    // upload entry images
    const newEntries = [...entries]
    const promiseArray: Promise<void | Response>[] = []
    let updatedLinks = 0
    entries.forEach(entry => {
      if(entryImages[entry.entryId]?.image) {
        promiseArray.push(createPostImageRequest(entryImages[entry.entryId].image)
          .then((res) => {
            if(res.ok) {
              return res.json().then((data) => {
                const newEntry = newEntries.find(e => e.entryId === entry.entryId)
                if(newEntry) {
                  newEntry.imageId = data.id
                  updatedLinks++
                }
              })
            } else {
              if(res.status === 413) {
                return res.json().then((data) => {
                  setErrorMessage(data.message)
                  handleRemoveImage(entry.entryId)
                })
              }
            }
          })
        )
      }
    })
    await Promise.all(promiseArray)
    const newTiernament: TiernamentDTO = {
      name: tiernamentName,
      description: tiernamentDescription,
      imageId: coverImageId || '',
      entries: newEntries
    }
    createTiernamentRequest(newTiernament)
      .then(r => {
          if (r.ok) {
            r.json().then(data => {
              console.log(data)
            })
          }
        }
      )
  }

  const handleCoverImageChange = (imageFile: File) => {
    if(imageFile) {
      const imageUrl = URL.createObjectURL(imageFile)
      setCoverImage({image: imageFile, url: imageUrl})
    }
  }

  const handleEntryImageChange = (imageFile: File, entryId: string) => {
    if(imageFile) {
      const imageUrl = URL.createObjectURL(imageFile)
      setEntryImages({...entryImages, [entryId]: {image: imageFile, url: imageUrl}})
      const newEntries = entries.map(entry => {
        if(entry.entryId === entryId) {
          return {...entry, imageId: imageUrl}
        }
        return entry
      })
      setEntries(newEntries)
    }
  }

  const handleEntryFromImage = (imageFiles: FileList) => {
    if(imageFiles) {
      const newEntryImages = {...entryImages}
      const newEntries = [...entries]
      for(let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i]
        const imageUrl = URL.createObjectURL(imageFile)
        const newEntryId = uuidv4()
        //remove everything behind last . in filename
        const name = imageFile.name.split('.').slice(0, -1).join('.')
        newEntryImages[newEntryId] = {image: imageFile, url: imageUrl}
        newEntries.push({entryId: newEntryId, name: name, imageId: imageUrl, placementHistory: []})
      }
      setEntryImages(newEntryImages)
      setEntries(newEntries)
    }
  }

  const handleAddEntry = () => {
    if(entryName) {
      setEntries([...entries, {entryId: uuidv4(), name: entryName, imageId: '', placementHistory: []}])
      setEntryName('')
    }
  }

  const handleDeleteEntry = (entryId: string) => {
    handleRemoveImage(entryId)
    setEntries(entries.filter(entry => entry.entryId !== entryId))
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
                          handleCoverImageChange(event.target.files![0])
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
                imageId: coverImage?.url || '',
                description: tiernamentDescription,
                date: new Date(),
              }}
              dummy
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Paper sx={{...styles.paper, marginTop: '10px'}}>
            <Tooltip title={t('createEntriesTooltip')} placement={'top-start'}>
              <Typography variant={'h6'} sx={{mb: '10px', ml: '5px'}}>
                {t('createTiernamentEntries', {count: entries.length})}
              </Typography>
            </Tooltip>
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
              <Divider sx={{ml: '5px', mr: '10px'}} flexItem orientation={'vertical'} />
              <Button component={'label'} variant={'contained'}>
                {t('entriesFromImages')}
                <input
                  type={'file'}
                  accept={'image/*'}
                  multiple
                  hidden
                  onChange={
                    event => {
                      if(event.target.files) {
                        handleEntryFromImage(event.target.files)
                      }
                    }
                  }
                />
              </Button>
            </Box>
            <Divider sx={{my: '10px'}} />
            <Box sx={{...styles.flexRow, pl: '5px', flexWrap: 'wrap'}}>
              {
                entries.map((entry, index) => (
                  <Paper key={index} sx={styles.entryBox}>
                    <Box sx={{m: '5px', mr: '10px'}}>
                      <Badge
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <Edit fontSize={'small'} color={'primary'}/>
                        }
                      >
                        <Tooltip title={t('changeImage')}>
                          <IconButton sx={{p: 0}} component={'label'}>
                            <CustomAvatar userName={entry.name} imageId={entry.imageId} size={{width: 25, height: 25}} dummy />
                            <input
                              type={'file'}
                              accept={'image/*'}
                              multiple={false}
                              hidden
                              onChange={
                                event => {
                                  if(event.target.files) {
                                    handleEntryImageChange(event.target.files![0], entry.entryId)
                                  }
                                }
                              }
                            />
                          </IconButton>
                        </Tooltip>
                      </Badge>
                    </Box>
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
                    <IconButton onClick={() => handleDeleteEntry(entry.entryId)}>
                      <DeleteForever fontSize={'small'} color={'primary'} />
                    </IconButton>
                  </Paper>
                ))
              }
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{display: 'flex', justifyContent: 'center'}}>
        <Button
          sx={{mt: '10px'}}
          variant={'contained'}
          color={'primary'}
          onClick={handleCreateTiernament}
        >
          {t('createTiernament')}
        </Button>
      </Box>
      <ErrorSnackbar errorMessage={errorMessage} setErrorMessage={setErrorMessage}/>
    </Box>
  )
}