import React from 'react';
import { TiernamentTitleType } from '../../util/types';
import { Box, Typography } from '@mui/material';
import TiernamentCard from '../tiernament/TiernamentCard';
import { useTranslation } from 'react-i18next';

interface ProfileTiernamentListProps {
  tiernaments: TiernamentTitleType[]
}

export default function ProfileTiernamentList(props: ProfileTiernamentListProps) {

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      mt: '10px',
      borderStyle: 'solid',
      borderWidth: '1px',
      borderColor: 'primary.main',
      borderRadius: '5px',
    }
  }

  const { t } = useTranslation()

  return (
    <Box sx={styles.container}>
      <Typography variant='h5' sx={{p: '5px', pl: '10px'}}>
        {t('profileTiernaments')}
      </Typography>
      <Box sx={{display: 'flex', flexDirection: 'row'}}>
        {
          props.tiernaments.map((tiernament, index) => {
            return <TiernamentCard key={index} tiernament={tiernament} />
          })
        }
      </Box>
    </Box>
  )
}