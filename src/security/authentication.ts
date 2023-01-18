import type express from 'express';

export function expressAuthentication(
  request: express.Request,
  securityName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  scopes?: string[],
): Promise<unknown> {
  if (securityName === 'nobody')
    return Promise.reject(new Error('Unauthorized'));

  return Promise.resolve();
}
