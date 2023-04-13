import React from 'react'
import { Backdrop, Box, Fade, Modal, Typography, useTheme } from '@mui/material';
import { getImageLink } from '../../apiRequests/imageRequests';
import { TiernamentRunEntryType } from '../../util/types';
import CustomAvatar from '../general/CustomAvatar';

interface WinnerModalProps {
  showModal: boolean,
  handleCloseModal: () => void,
  winner: TiernamentRunEntryType,
}

export default function WinnerModal(props: WinnerModalProps) {

  const theme = useTheme()

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
    modalEntry: {
      marginTop: 4,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 300,
      minWidth: 300,
      borderStyle: 'solid',
      borderColor: theme.palette.tertiary.main,
      borderWidth: '2px',
      borderRadius: '5px',
      padding: '5px',
    },
  }

  return (
    <Modal
      open={props.showModal}
      onClose={props.handleCloseModal}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={props.showModal}>
        <Box sx={styles.modal}>
          <CustomAvatar userName={'Winner'} imageId={'/tiernamentIcon.png'} dummy size={{height: 100, width: 100}} />
          <Box sx={styles.modalEntry}>
            <Typography variant={'h5'} flexWrap={'wrap'} maxWidth={400}>
              {props.winner.name}
            </Typography>
            {
              props.winner.imageId &&
                <Box
                    component={'img'}
                    src={getImageLink(props.winner.imageId)}
                    alt={props.winner.name}
                    sx={{
                      maxWidth: 400,
                      height: 250,
                    }}
                />
            }
          </Box>
        </Box>
      </Fade>
    </Modal>
  )
}