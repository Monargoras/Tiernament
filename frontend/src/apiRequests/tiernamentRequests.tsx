import { createRequest } from './requestGenerator';

export function fetchTiernaments() {
  return createRequest('GET', 'api/tiernament/public')
}

export function fetchTiernamentById(tiernamentId: string) {
  return createRequest('GET', 'api/tiernament/public', undefined, tiernamentId)
}