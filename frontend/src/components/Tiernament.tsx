import React from 'react';
import { LoaderFunctionArgs, useLoaderData} from 'react-router-dom';

import { fetchTiernamentById } from '../util/ApiRequests';
import { TiernamentType } from '../util/types';

export async function loader(params: { tiernamentId: string }) {
    const res = await fetchTiernamentById(params.tiernamentId)
    const data = await res.json()
    return data
}

export default function Tiernament() {
    const tiernament = useLoaderData() as TiernamentType;

    return (
        <div>
            <h3>Tiernament</h3>
            <p>{tiernament.name}</p>
        </div>
    )
}