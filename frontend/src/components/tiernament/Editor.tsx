import React from 'react';
import { useAppSelector } from '../../redux/hooks';
import { Box, Button, IconButton, Grid, Paper, TextField, Typography, Tooltip, Divider, Badge } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { createDeleteImageRequest, createPostImageRequest, getImageLink } from '../../apiRequests/imageRequests';
import ErrorSnackbar from '../../components/general/ErrorSnackbar';
import { Add, AddAPhoto, DeleteForever, Edit, Help } from '@mui/icons-material';
import TiernamentCard from '../../components/tiernament/TiernamentCard';
import { TiernamentDTO, TiernamentEntryType, TiernamentType } from '../../util/types';
import CustomAvatar from '../general/CustomAvatar';
import { v4 as uuidv4 } from 'uuid';
import { createDeleteTiernamentRequest, createPatchTiernamentRequest, createTiernamentRequest } from '../../apiRequests/tiernamentRequests';
import { useNavigate } from 'react-router-dom';
import DeleteModal from '../general/DeleteModal';

interface EditorProps {
  tiernament?: TiernamentType
}

export default function Editor(props: EditorProps) {

  const authState = useAppSelector(state => state.auth)
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [tiernamentName, setTiernamentName] = React.useState(props.tiernament?.name || '')
  const [tiernamentDescription, setTiernamentDescription] = React.useState(props.tiernament?.description || '')
  const [errorMessage, setErrorMessage] = React.useState('')
  const [coverImage, setCoverImage] = React.useState<{image: File | undefined, url: string} | undefined>(undefined)
  const [entries, setEntries] = React.useState<TiernamentEntryType[]>(props.tiernament?.entries || [])
  const [entryImages, setEntryImages] = React.useState<{[key: string]: {image: File | undefined, url: string}}>({})
  const [entryName, setEntryName] = React.useState('')
  const [nameError, setNameError] = React.useState(false)
  const [descriptionError, setDescriptionError] = React.useState(false)
  const [entryError, setEntryError] = React.useState(false)
  const [changedImageIds, setChangedImageIds] = React.useState<string[]>([])
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = React.useState('')
  const [deleteConfirmTextError, setDeleteConfirmTextError] = React.useState(false)

  React.useEffect(() => {
    if(props.tiernament) {
      // get cover image file from saved imageId
      if(props.tiernament.imageId) {
        setCoverImage({image: undefined, url: getImageLink(props.tiernament.imageId)})
      }
      // get entry images from saved imageIds
      const newEntryImages: {[key: string]: {image: File | undefined, url: string}} = {}
      const newEntries = [...entries]
      props.tiernament.entries.forEach(entry => {
        if(entry.imageId) {
          const url = getImageLink(entry.imageId)
          newEntryImages[entry.entryId] = {image: undefined, url: getImageLink(entry.imageId)}
          const index = newEntries.findIndex(e => e.entryId === entry.entryId)
          newEntries[index] = {...entry, imageId: url}
        }
      })
      setEntryImages(newEntryImages)
      setEntries(newEntries)
    }
  }, [])

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
    createEntryContainer: {
      padding: '10px',
      marginTop: '10px',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: entryError ? 'error.main' : 'transparent',
      borderRadius: '5px',
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
      return props.tiernament?.imageId || ''
    }
  }

  const validateEntryNames = () => {
    //check if any entry has empty name
    let hasEmptyName = false
    entries.forEach(entry => {
      if(entry.name.length === 0) {
        setEntryError(true)
        hasEmptyName = true
      }
    })
    return hasEmptyName
  }

  const validateInput = () => {
    if(tiernamentName.length === 0) {
      setNameError(true)
    }
    if(tiernamentDescription.length === 0) {
      setDescriptionError(true)
    }
    if(entries.length < 8 || entries.length > 32) {
      setEntryError(true)
    }
    const hasEmptyName = validateEntryNames()
    return !(tiernamentName.length === 0 || tiernamentDescription.length === 0 || entries.length < 8 || entries.length > 32 || hasEmptyName)
  }

  const handleCreateOrPatchTiernament = async () => {
    if(!validateInput()) {
      return
    }
    // upload cover image
    const coverImageId = await handleCoverImagePost()
    // upload entry images
    const newEntries = [...entries]
    const promiseArray: Promise<void | Response>[] = []
    let updatedLinks = 0
    entries.forEach(entry => {
      if(entryImages[entry.entryId] && entryImages[entry.entryId].image !== undefined) {
        const image = entryImages[entry.entryId].image as File
        promiseArray.push(createPostImageRequest(image)
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
      } else if(props.tiernament) {
        const newEntry = newEntries.find(e => e.entryId === entry.entryId)
        if(newEntry) {
          newEntry.imageId = props.tiernament.entries.find(e => e.entryId === entry.entryId)?.imageId || ''
        }
      }
    })
    await Promise.all(promiseArray)

    // cleanup all images that were changed
    const promiseArray2: Promise<void | Response>[] = []
    changedImageIds.forEach(id => {
      promiseArray2.push(createDeleteImageRequest(id))
    })
    await Promise.all(promiseArray2)

    const newTiernament: TiernamentDTO = {
      name: tiernamentName,
      description: tiernamentDescription,
      imageId: coverImageId || '',
      entries: newEntries
    }
    if(props.tiernament === undefined) {
      createTiernamentRequest(newTiernament)
        .then(r => {
            if(r.ok) {
              r.json().then(() => {
                if(authState.user) {
                  navigate(`/profile/${authState.user.name}`)
                }
              })
            }
          }
        )
    } else {
      createPatchTiernamentRequest(props.tiernament.tiernamentId, newTiernament)
        .then(r => {
          if(r.ok) {
            r.json().then(() => {
              if(authState.user) {
                navigate(`/profile/${authState.user.name}`)
              }
            })
          }
        }
      )
    }
  }

  const handleCoverImageChange = (imageFile: File) => {
    if(imageFile) {
      // check if previous image was in database and mark for deletion
      if(props.tiernament && props.tiernament.imageId) {
        setChangedImageIds([...changedImageIds, props.tiernament.imageId])
      }
      const imageUrl = URL.createObjectURL(imageFile)
      setCoverImage({image: imageFile, url: imageUrl})
    }
  }

  const handleEntryImageChange = (imageFile: File, entryId: string) => {
    if(imageFile) {
      // check if previous image was in database and mark for deletion
      if(props.tiernament && props.tiernament.entries) {
        const entry = props.tiernament.entries.find(e => e.entryId === entryId)
        if(entry && entry.imageId) {
          setChangedImageIds([...changedImageIds, entry.imageId])
        }
      }
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

  const handleEntryNameChange = (index: number, newName: string) => {
    const newEntries = [...entries]
    newEntries[index].name = newName
    if(entryError && newName.length > 0) {
      setEntryError(validateEntryNames)
    }
    setEntries(newEntries)
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
      if(entryError && newEntries.length > 7) {
        setEntryError(false)
      }
      setEntryImages(newEntryImages)
      setEntries(newEntries)
    }
  }

  const handleAddEntry = () => {
    if(entryName) {
      if(entryError && entries.length > 6) {
        setEntryError(false)
      }
      setEntries([...entries, {entryId: uuidv4(), name: entryName, imageId: '', placementHistory: []}])
      setEntryName('')
    }
  }

  const handleDeleteEntry = (entryId: string) => {
    handleRemoveImage(entryId)
    setEntries(entries.filter(entry => entry.entryId !== entryId))
  }

  const handleDeleteTiernament = () => {
    if(tiernamentName === deleteConfirmText) {
      if (props.tiernament) {
        createDeleteTiernamentRequest(props.tiernament.tiernamentId)
          .then(r => {
            if (r.ok) {
              if (authState.user) {
                navigate(`/profile/${authState.user.name}`)
              }
            }
          })
      }
    } else {
      setDeleteConfirmTextError(true)
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
                  error={nameError}
                  onChange={(event) => {
                    setTiernamentName(event.target.value)
                    setNameError(false)
                  }}
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
                error={descriptionError}
                onChange={(event) => {
                  setTiernamentDescription(event.target.value)
                  setDescriptionError(false)
                }}
                multiline
                maxRows={10}
              />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={3}>
          <Box sx={styles.flexColumn}>
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
          <Paper sx={styles.createEntryContainer}>
            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', mb: '10px', ml: '5px'}}>
              <Typography variant={'h6'}>
                {t('createTiernamentEntries', {count: entries.length})}
              </Typography>
              <Tooltip title={t('createEntriesTooltip')} arrow placement={'top'}>
                <Help color={'primary'}/>
              </Tooltip>
            </Box>
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
                      error={entryError && entry.name.length === 0}
                      onChange={(event) => {
                        handleEntryNameChange(index, event.target.value)
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
          onClick={handleCreateOrPatchTiernament}
        >
          {props.tiernament ? t('editConfirm') : t('createTiernament')}
        </Button>
        {
          props.tiernament &&
          <Button
            sx={{mt: '10px', ml: '10px'}}
            variant={'contained'}
            color={'secondary'}
            onClick={() => setDeleteModalOpen(true)}
          >
            {t('deleteTiernament')}
          </Button>
        }
      </Box>
      <DeleteModal
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        deleteConfirmText={deleteConfirmText}
        setDeleteConfirmText={setDeleteConfirmText}
        deleteConfirmTextError={deleteConfirmTextError}
        setDeleteConfirmTextError={setDeleteConfirmTextError}
        comparisonName={tiernamentName}
        handleDelete={handleDeleteTiernament}
      />
      <ErrorSnackbar errorMessage={errorMessage} setErrorMessage={setErrorMessage}/>
    </Box>
  )
}