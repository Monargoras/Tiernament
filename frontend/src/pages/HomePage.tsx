import React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Carousel from 'react-material-ui-carousel';
import { TiernamentTitleType } from '../util/types';
import TiernamentCard from '../components/tiernament/TiernamentCard';
import { fetchRandomTen } from '../apiRequests/tiernamentRequests';

export async function loader() {
  const res = await fetchRandomTen()
  return await res.json()
}

export default function HomePage() {

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
  }

  const navigate = useNavigate()
  const { t } = useTranslation()
  const tiernaments = useLoaderData() as TiernamentTitleType[]

  return (
    <Box sx={styles.container}>
      <Typography variant={'h2'}>
        {t('homePageTitle')}
      </Typography>
      <Typography variant={'h6'} sx={{maxWidth: '50%', my: '20px'}}>
        {t('homePageText')}
      </Typography>
      <Carousel
        sx={{width: 260, height: 400}}
        autoPlay={true}
        swipe={true}
        indicators={false}
        animation={'slide'}
        navButtonsAlwaysVisible={false}
      >
        {tiernaments.map(tiernament => (
          <TiernamentCard tiernament={tiernament} key={tiernament.tiernamentId}/>
        ))}
      </Carousel>
      <Button variant={'contained'} onClick={() => navigate('/tiernament')}>
        {t('exploreTiernaments')}
      </Button>
    </Box>
  )
}