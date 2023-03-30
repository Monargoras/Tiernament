import { createRequest } from './requestGenerator';
import { TiernamentDTO } from '../util/types';

export function fetchTiernaments() {
  return createRequest('GET', 'api/tiernament/get')
}

export function fetchTiernamentById(tiernamentId: string) {
  return createRequest('GET', 'api/tiernament/get', undefined, tiernamentId)
}

export function createTiernamentRequest(tiernament: TiernamentDTO) {
  return createRequest('POST', 'api/tiernament/edit', tiernament, undefined, true)
}