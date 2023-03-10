import React from 'react';
import { Link, Outlet, useLoaderData } from 'react-router-dom';

import { fetchTiernaments } from '../util/ApiRequests';
import { TiernamentType} from '../util/types';

export async function loader() {
    const res = await fetchTiernaments()
    const data = await res.json()
    return data
}

export default function TiernamentPage() {
    const tiernaments = useLoaderData() as TiernamentType[];
    return (
        <div>
            <h1>Tiernament Page</h1>
            {
                tiernaments.map((tiernament: TiernamentType, index) => (
                    <p key={index}>
                        <Link to={`${tiernament.tiernamentId}`}>
                            {tiernament.name}
                        </Link>
                    </p>
                ))
            }
            <button>
                <Link to={'/'}>Home</Link>
            </button>
            <button>
                <Link to={'1'}>Tiernament</Link>
            </button>
            <Outlet />
        </div>
    )
}