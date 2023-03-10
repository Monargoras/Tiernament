import { createRequest } from './requestGenerator';

export function fetchTiernaments() {
    createRequest('GET', 'api/tiernament')
        .then(res => {
            if(res) res.json().then(data => {
                if(res.ok) {
                    console.log(data)
                    return data
                }
                else
                    alert(data.message)
                return null
            })
        })
        .catch((e) => console.log(e))
}

export function fetchTiernamentById(tiernamentId: string) {
    createRequest('GET', 'api/tiernament', undefined, tiernamentId)
        .then(res => {
            if(res) res.json().then(data => {
                if(res.ok) {
                    console.log(data)
                    return data
                }
                else
                    alert(data.message)
            })
        })
        .catch((e) => console.log(e))
}