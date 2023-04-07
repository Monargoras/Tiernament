import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { fetchTiernamentsBySearchTerm } from '../apiRequests/tiernamentRequests';
import { TiernamentTitleType } from '../util/types';
import { Box, Divider, Typography } from '@mui/material';
import TiernamentCard from '../components/tiernament/TiernamentCard';
import { useTranslation } from 'react-i18next';

export async function loader(params: { searchTerm: string }) {
  const res = await fetchTiernamentsBySearchTerm(params.searchTerm)
  const data = await res.json()
  return { tiernaments: data, searchTerm: params.searchTerm }
}

export default function SearchPage() {

  const { tiernaments, searchTerm } = useLoaderData() as { tiernaments: TiernamentTitleType[], searchTerm: string }
  const { t } = useTranslation()

  return (
    <Box>
      <Box>
        <Typography variant={'h5'} sx={{mb: '5px', ml: '10px'}}>
          {t('searchFor', {searchTerm: searchTerm})}
        </Typography>
        <Divider />
      </Box>
      <Box sx={{display: 'flex', flexDirection: 'row'}}>
        {
          tiernaments.map((tiernament: TiernamentTitleType, index) => (
            <TiernamentCard key={index} tiernament={tiernament} />
          ))
        }
      </Box>
    </Box>
  )
}