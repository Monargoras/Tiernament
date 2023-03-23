import { createRequest } from './requestGenerator';

export function fetchTiernaments() {
  return createRequest('GET', 'api/tiernament/get')
}

export function fetchTiernamentById(tiernamentId: string) {
  return createRequest('GET', 'api/tiernament/get', undefined, tiernamentId)
}