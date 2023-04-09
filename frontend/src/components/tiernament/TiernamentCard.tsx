import React from 'react';
import { TiernamentTitleType } from '../../util/types';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { getImageLink } from '../../apiRequests/imageRequests';
import { useTranslation } from 'react-i18next';
import CustomAvatar from '../general/CustomAvatar';

interface TiernamentCardProps {
  tiernament: TiernamentTitleType
  dummy?: boolean
}

export default function TiernamentCard(props: TiernamentCardProps) {

  const navigate = useNavigate()
  const { t } = useTranslation()

  const styles = {
    card: {
      cursor: 'pointer',
      margin: props.dummy ? '0px' : '10px',
      width: 250,
    }
  }

  const handleNavigate = () => {
    if(!props.dummy) {
      navigate(`/tiernament/${props.tiernament.tiernamentId}`)
    }
  }

  return (
    <Card sx={styles.card}>
      <CardActionArea onClick={handleNavigate} sx={{height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'start'}}>
        <CardMedia
          component={'img'}
          height={'150'}
          image={props.tiernament.imageId !== '' && !props.dummy ? getImageLink(props.tiernament.imageId) :
            props.tiernament.imageId !== '' && props.dummy ? props.tiernament.imageId : '/tiernamentIcon.png'
          }
          alt={props.tiernament.name}
          sx={{objectFit: 'contain'}}
        />
        <CardContent>
          <Typography gutterBottom variant={'h5'} component={'div'}>
            {props.tiernament.name}
          </Typography>
          <Box sx={{display: 'flex', flexDirection: 'row'}}>
            <Typography gutterBottom variant={'body1'}>
              {t('byAuthor', {authorName: props.tiernament.authorDisplayName})}
            </Typography>
            <div style={{width: '5px'}} />
            <CustomAvatar userName={props.tiernament.authorDisplayName} imageId={props.tiernament.authorAvatarId} size={{height: 25, width: 25}} />
          </Box>
          <Typography variant={'body2'} color={'text.secondary'}>
            {props.tiernament.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}