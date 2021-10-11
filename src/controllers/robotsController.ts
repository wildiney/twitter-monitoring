import { Request, Response } from 'express'
export const robots = (request: Request, response: Response) => {
  response.type('text/plain')
  response.send(
    `User-agent: *
    Disallow: /`
  )
}
