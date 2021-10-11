import { Request, Response } from 'express'

const rules: string = `User-agent: *
Disallow: /
`

export const robots = (request: Request, response: Response) => {
  response.type('text/plain')
  response.send(rules)
}
