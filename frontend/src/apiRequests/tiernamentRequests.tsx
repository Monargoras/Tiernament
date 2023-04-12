import { createRequest } from './requestGenerator';
import { TiernamentDTO } from '../util/types';

export function fetchTiernaments() {
  return createRequest('GET', 'api/tiernament/get')
}

export function fetchRandomTen() {
  return createRequest('GET', 'api/tiernament/get/randomTen')
}

export function fetchTiernamentsBySearchTerm(searchTerm: string) {
  return createRequest('GET', 'api/tiernament/get/search', undefined, searchTerm)
}

export function fetchTiernamentById(tiernamentId: string) {
  return createRequest('GET', 'api/tiernament/get', undefined, tiernamentId)
}

export function createTiernamentRequest(tiernament: TiernamentDTO) {
  return createRequest('POST', 'api/tiernament/edit', tiernament, undefined, true)
}

export function fetchTiernamentsByUsername(username: string) {
  return createRequest('GET', 'api/tiernament/get/author', undefined, username)
}