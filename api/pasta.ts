import { NowRequest, NowResponse } from '@vercel/node'
import pastat from '../pastas'

const isValidQuery = (query: string | string[]): query is string => typeof query === 'string'
const isValidPasta = (availablePastas: {[key:string]: string}, pasta: string): pasta is keyof typeof pastat => {
    const pastas = Object.keys(availablePastas)
    return pastas.includes(pasta)
}

export default (request: NowRequest, response: NowResponse) => {
  const { text: pasta } = request.query
  if (isValidQuery(pasta) && isValidPasta(pastat, pasta)) {
    return response.status(200).send(pastat[pasta])
  }
  return response.status(200).send(`Couldn't find that pasta. Please use one of the following: ${Object.keys(pastat).join(', ')}`)
}