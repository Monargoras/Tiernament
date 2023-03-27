import React from 'react';
import { Link, useLoaderData } from 'react-router-dom';

import { fetchTiernaments } from '../apiRequests/tiernamentRequests';
import { TiernamentTitleType } from '../util/types';

export async function loader() {
  const res = await fetchTiernaments()
  return await res.json()
}

export default function TiernamentPage() {
  const tiernaments = useLoaderData() as TiernamentTitleType[];
  return (
    <div>
      <h1>Tiernament Page</h1>
      {
        tiernaments.map((tiernament: TiernamentTitleType, index) => (
          <p key={index}>
            <Link to={`/tiernament/${tiernament.tiernamentId}`}>
              {tiernament.name}
            </Link>
          </p>
        ))
      }
      <button>
        <Link to={'/'}>Home</Link>
      </button>
    </div>
  )
}