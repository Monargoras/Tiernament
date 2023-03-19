import { createRequest } from './requestGenerator';

export function fetchTiernaments() {
  return createRequest('GET', 'api/tiernament')
}

export function fetchTiernamentById(tiernamentId: string) {
  return createRequest('GET', 'api/tiernament', undefined, tiernamentId)
}