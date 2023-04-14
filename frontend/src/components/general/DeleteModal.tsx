import React from 'react';
import { Box, Button, Fade, Modal, TextField, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface DeleteModalProps {
  deleteModalOpen: boolean,
  setDeleteModalOpen: (open: boolean) => void,
  deleteConfirmText: string,
  setDeleteConfirmText: (text: string) => void,
  deleteConfirmTextError: boolean,
  setDeleteConfirmTextError: (error: boolean) => void,
  comparisonName: string,
  handleDelete: () => void,
}

export default function DeleteModal(props: DeleteModalProps) {

  const theme = useTheme()
  const { t } = useTranslation()

  const styles = {
    modal: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'background.paper',
      border: '2px solid #000',
      borderColor: theme.palette.primary.main,
      borderRadius: '5px',
      boxShadow: 24,
      p: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    textField: {
      marginX: '5px',
    },
  }

  return (
    <Modal open={props.deleteModalOpen} onClose={() => props.setDeleteModalOpen(false)}>
      <Fade in={props.deleteModalOpen}>
        <Box sx={styles.modal}>
          <Typography variant={'h6'} sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', mb: '10px'}}>
            {t('deleteConfirm', {name: props.comparisonName})}
          </Typography>
          <TextField
            id={'deleteText'}
            label={t('entryName')}
            variant={'outlined'}
            sx={styles.textField}
            value={props.deleteConfirmText}
            onChange={(event) => {
              props.setDeleteConfirmTextError(false)
              props.setDeleteConfirmText(event.target.value)
            }}
            error={props.deleteConfirmTextError}
            onKeyDown={(event) => {
              if(event.key === 'Enter') {
                props.handleDelete()
              }
            }}
          />
          <Box sx={{display: 'flex', justifyContent: 'center', mt: '10px'}}>
            <Button
              sx={{mr: '10px'}}
              variant={'contained'}
              color={'secondary'}
              onClick={() => props.setDeleteModalOpen(false)}
            >
              {t('cancel')}
            </Button>
            <Button
              variant={'contained'}
              color={'primary'}
              onClick={props.handleDelete}
            >
              {t('delete')}
            </Button>

          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}