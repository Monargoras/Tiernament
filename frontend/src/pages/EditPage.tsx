import React from 'react';
import { useLoaderData } from 'react-router-dom';
import { TiernamentType } from '../util/types';
import Editor from '../components/tiernament/Editor';
import { Box } from '@mui/material';
import { createGetTiernamentForEditRequest } from '../apiRequests/tiernamentRequests';

export async function loader(params: { tiernamentId: string }) {
  const res = await createGetTiernamentForEditRequest(params.tiernamentId)
  return await res.json()
}

export default function EditPage() {

  const tiernament = useLoaderData() as TiernamentType

  return (
    <Box>
      <Editor tiernament={tiernament} />
    </Box>
  )
}