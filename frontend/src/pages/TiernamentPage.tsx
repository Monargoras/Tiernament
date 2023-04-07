import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { fetchTiernaments } from '../apiRequests/tiernamentRequests';
import { TiernamentTitleType } from '../util/types';
import TiernamentCard from '../components/tiernament/TiernamentCard';
import { Box } from '@mui/material';

export async function loader() {
  const res = await fetchTiernaments()
  return await res.json()
}

export default function TiernamentPage() {
  const tiernaments = useLoaderData() as TiernamentTitleType[];
  return (
    <Box sx={{display: 'flex', flexDirection: 'row'}}>
      {
        tiernaments.map((tiernament: TiernamentTitleType, index) => (
          <TiernamentCard key={index} tiernament={tiernament} />
        ))
      }
    </Box>
  )
}