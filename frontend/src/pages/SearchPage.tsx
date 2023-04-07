import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import { fetchTiernamentsBySearchTerm } from '../apiRequests/tiernamentRequests';
import { TiernamentTitleType } from '../util/types';
import { Typography } from '@mui/material';

export async function loader(params: { searchTerm: string }) {
  const res = await fetchTiernamentsBySearchTerm(params.searchTerm)
  const data = await res.json()
  return { tiernaments: data, searchTerm: params.searchTerm }
}

export default function SearchPage() {
  const { tiernaments, searchTerm } = useLoaderData() as { tiernaments: TiernamentTitleType[], searchTerm: string };
  return (
    <div>
      <Typography variant={'h3'}>
        Search Page for {searchTerm}
      </Typography>
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