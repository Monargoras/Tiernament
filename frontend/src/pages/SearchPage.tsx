import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { fetchTiernamentsBySearchTerm } from '../apiRequests/tiernamentRequests';
import { TiernamentTitleType } from '../util/types';
import { Box, Divider, Typography } from '@mui/material';
import TiernamentCard from '../components/tiernament/TiernamentCard';

export async function loader(params: { searchTerm: string }) {
  const res = await fetchTiernamentsBySearchTerm(params.searchTerm)
  const data = await res.json()
  return { tiernaments: data, searchTerm: params.searchTerm }
}

export default function SearchPage() {
  const { tiernaments, searchTerm } = useLoaderData() as { tiernaments: TiernamentTitleType[], searchTerm: string };
  return (
    <div>
      <Box>
        <Typography variant={'h5'} sx={{mb: '5px', ml: '10px'}}>
          Search for "{searchTerm}"
        </Typography>
        <Divider />
      </Box>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        {
          tiernaments.map((tiernament: TiernamentTitleType, index) => (
            <TiernamentCard key={index} tiernament={tiernament} />
          ))
        }
      </div>
    </div>
  )
}