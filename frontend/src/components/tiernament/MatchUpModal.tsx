import React from 'react'
import { Backdrop, Box, Fade, Modal, Typography, useTheme } from '@mui/material';
import { getImageLink } from '../../apiRequests/imageRequests';
import { MatchUpType, TiernamentRunEntryType } from '../../util/types';

interface MatchUpModalProps {
  showModal: boolean,
  handleCloseModal: () => void,
  entryA: TiernamentRunEntryType | undefined,
  entryB: TiernamentRunEntryType | undefined,
  matchUp: MatchUpType,
  handleMatchUpUpdate: (matchUpId: string, newWinner: 'A' | 'B') => void,
}

export default function MatchUpModal(props: MatchUpModalProps) {

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
      flexDirection: 'row',
      alignItems: 'center',
    },
    modalEntry: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 300,
      minWidth: 300,
      cursor: props.matchUp.winner === undefined && props.matchUp.entryAId && props.matchUp.entryBId ? 'pointer' : 'default'
    },
    modalEntryBorderA: {
      borderStyle: 'solid',
      borderColor: props.matchUp.winner === 'A' ? theme.palette.tertiary.main :
        props.matchUp.winner === 'B' ? theme.palette.error.main : theme.palette.text.primary,
      borderWidth: '2px',
      borderRadius: '5px',
      padding: '5px',
    },
    modalEntryBorderB: {
      borderStyle: 'solid',
      borderColor: props.matchUp.winner === 'B' ? theme.palette.tertiary.main :
        props.matchUp.winner === 'A' ? theme.palette.error.main : theme.palette.text.primary,
      borderWidth: '2px',
      borderRadius: '5px',
      padding: '5px',
    },
  }

  const handleMatchUpUpdate = (winner: 'A' | 'B') => {
    if (props.matchUp.winner === undefined) {
      props.handleMatchUpUpdate(props.matchUp.matchUpId, winner)
    }
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
          <Box sx={{...styles.modalEntry, ...styles.modalEntryBorderA}} onClick={() => handleMatchUpUpdate('A')}>
            <Typography variant={'h5'} flexWrap={'wrap'} maxWidth={400}>
              {props.entryA ? props.entryA.name : '-'}
            </Typography>
            {
              props.entryA && props.entryA.imageId &&
                <Box
                    component={'img'}
                    src={getImageLink(props.entryA.imageId)}
                    alt={props.entryA.name}
                    sx={{
                      maxWidth: 400,
                      height: 250,
                    }}
                />
            }
          </Box>
          <Typography variant={'h5'} sx={{p: '15px'}}>vs.</Typography>
          <Box sx={{...styles.modalEntry, ...styles.modalEntryBorderB}} onClick={() => handleMatchUpUpdate('B')}>
            <Typography variant={'h5'} flexWrap={'wrap'} maxWidth={400}>
              {props.entryB ? props.entryB.name : '-'}
            </Typography>
            {
              props.entryB && props.entryB.imageId &&
                <Box
                    component={'img'}
                    src={getImageLink(props.entryB.imageId)}
                    alt={props.entryB.name}
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