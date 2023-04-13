import React from 'react';
import { TiernamentTitleType } from '../../util/types';
import { Badge, Box, IconButton, Tooltip, Typography } from '@mui/material';
import TiernamentCard from '../tiernament/TiernamentCard';
import { useTranslation } from 'react-i18next';
import { Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate()

  const handleNavigate = (id: string) => {
    navigate(`/tiernament/edit/${id}`)
  }

  return (
    <Box sx={styles.container}>
      <Typography variant='h5' sx={{p: '5px', pl: '10px'}}>
        {t('profileTiernaments')}
      </Typography>
      <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
        {
          props.tiernaments.map((tiernament, index) => {
            return (
              <Badge
                key={index}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                badgeContent={
                  <Tooltip title={t('edit')}>
                    <IconButton
                      size='large'
                      sx={{color: 'primary.main'}}
                      onClick={() => handleNavigate(tiernament.tiernamentId)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                }
              >
                <Box sx={{cursor: 'pointer', marginLeft: '20px'}}>
                  <TiernamentCard key={index} tiernament={tiernament} />
                </Box>
              </Badge>
            )
          })
        }
      </Box>
    </Box>
  )
}