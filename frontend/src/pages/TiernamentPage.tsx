import React from 'react';
import { Outlet, useLoaderData, Link } from 'react-router-dom';

import { fetchTiernaments } from '../util/ApiRequests';
import { Tiernament } from '../util/types';

export async function loader() {
    const tiernaments = fetchTiernaments()
    return { tiernaments }
}

export default function TiernamentPage() {
    // @ts-ignore
    const { tiernaments } = useLoaderData();
    return (
        <div>
            <h1>Tiernament Page</h1>
            <nav>
                {
                    tiernaments && tiernaments.length ? (
                    <ul>
                        {tiernaments.map((tiernament: Tiernament, index: number) => (
                            <li key={index}>
                                <Link to={`contacts/${tiernament.tiernamentId}`}>
                                    tiernament.name
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>
                        <i>No tiernaments</i>
                    </p>
                )}
            </nav>
            <Outlet />
        </div>
    )
}