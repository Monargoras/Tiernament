import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { fetchTiernaments } from '../apiRequests/tiernamentRequests';
import { TiernamentTitleType } from '../util/types';
import { Typography } from '@mui/material';

export async function loader() {
  const res = await fetchTiernaments()
  return await res.json()
}

export default function TiernamentPage() {
  const tiernaments = useLoaderData() as TiernamentTitleType[];
  return (
    <div>
      <Typography variant={'h3'}>Tiernament Page</Typography>
      {
        tiernaments.map((tiernament: TiernamentTitleType, index) => (
          <Typography key={index}>
            <Link to={`/tiernament/${tiernament.tiernamentId}`}>
              {tiernament.name}
            </Link>
          </Typography>
        ))
      }
    </div>
  )
}