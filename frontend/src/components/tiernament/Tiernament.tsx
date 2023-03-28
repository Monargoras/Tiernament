import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { fetchTiernamentById } from '../../apiRequests/tiernamentRequests';
import { TiernamentType } from '../../util/types';
import PlayOffDiagram from './PlayOffDiagram';

export async function loader(params: { tiernamentId: string }) {
  const res = await fetchTiernamentById(params.tiernamentId)
  return await res.json()
}

const placeholderTiernament: TiernamentType = {
  tiernamentId: '1',
  authorId: '1',
  name: 'Placeholder Tiernament',
  description: 'Placeholder Tiernament Description',
  date: new Date(),
  entries: [
    {
      entryId: '1',
      name: 'Fop',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '2',
      name: 'Dt',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '3',
      name: 'Mathe 1',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '4',
      name: 'Mathe 2',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '5',
      name: 'Ro',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '6',
      name: 'Afe',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '7',
      name: 'Apl',
      imageLink: '',
      placementHistory: [],
    },
    {
      entryId: '8',
      name: 'Aud',
      imageLink: '',
      placementHistory: [],
    }
  ]
}

export default function Tiernament() {
  const tiernament = useLoaderData() as TiernamentType;

  return (
    <div>
      <h3>Tiernament</h3>
      <p>{tiernament.name}</p>
      <PlayOffDiagram />
    </div>
  )
}