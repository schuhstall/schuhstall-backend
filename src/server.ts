import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import type {
  NextFunction,
  Request as ExRequest,
  Response as ExResponse,
} from 'express';
import express from 'express';
import isEmpty from 'lodash/isEmpty';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import type {Exception} from 'tsoa';
import {ValidateError} from 'tsoa';
import {RateLimit} from './helpers/rate-limit';
import logger from './logger';
import {RegisterRoutes} from './routes/routes';
import SwaggerDocument from './swagger.json';

dotenv.config();

export const app = express();

const options = {
  swaggerOptions: {
    displayRequestDuration: true,
  },
};

/** Use body parser to read sent json payloads */
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(bodyParser.json());

/** Logging */
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
else
  app.use(
    morgan(
      (tokens, req, res) => {
        return (
          `${req.get('do-connecting-ip') || req.ip} => ${tokens.status(
            req,
            res,
          )} ${tokens.method(req, res)} ${tokens.url(req, res)} (${tokens[
            'response-time'
          ](req, res)} ms) ` +
          JSON.stringify({
            ip: req.get('do-connecting-ip') || req.ip,
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: Number(tokens.status(req, res)),
            'content-length': Number(tokens.res(req, res, 'content-length')),
            'response-time': Number(tokens['response-time'](req, res)),
            'request-body': isEmpty(req.body) ? undefined : req.body,
          })
        );
      },
      {
        stream: {
          // Use the http severity
          write: (message) => {
            const statusRegex = message.match(/"status":(\d\d\d)/);
            const statusNo =
              statusRegex && statusRegex.length > 1
                ? Number(statusRegex[1])
                : NaN;
            if (isNaN(statusNo) || statusNo < 400) return logger.http(message);
            if (statusNo < 500) return logger.warn(message);
            return logger.error(message);
          },
        },
      },
    ),
  );

/** Takes care of our swagger documentation */
if (process.env.NODE_ENV === 'development') {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(SwaggerDocument, options));
}

/** RULES OF OUR API */
app.use((req, res, next) => {
  // set the CORS policy
  res.header('Access-Control-Allow-Origin', '*');
  // set the CORS headers
  res.header(
    'Access-Control-Allow-Headers',
    'origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  // set the CORS method headers
  if (req.method === 'OPTIONS') {
    res.header(
      'Access-Control-Allow-Methods',
      'GET, OPTIONS, DELETE, POST, PUT',
    );
    return res.status(200).json({});
  }

  next();
});

/** Routes */
RegisterRoutes(app);

/** Error handling */
app.use(RateLimit(3, 1000 * 60 * 10), (_req, res: ExResponse) => {
  res.status(404).send({
    message: 'Not Found',
  });
});

app.use(
  (
    err: unknown,
    req: ExRequest,
    res: ExResponse,
    next: NextFunction,
  ): ExResponse | void => {
    if (err instanceof ValidateError) {
      logger.debug(`Caught Validation Error for ${req.path}:`, err.fields);
      return res.status(422).json({
        message: 'Validation Failed',
        details: err?.fields,
      });
    }

    if ((err as Exception).status < 500 && err instanceof Error) {
      return res.status((err as Exception).status).send(err.message);
    }

    if (err instanceof Error) {
      logger.debug(`Caught Internal Server Error for ${req.path}:`, err);
      return res.status(500).json({
        message: 'Internal Server Error',
      });
    }

    next();
  },
);

/** Server */
const PORT = process.env.PORT ?? 8080;

app.listen(PORT, () => {
  logger.info(`The server is running on port ${PORT}`);
  if (process.env.NODE_ENV !== 'production')
    logger.info(`visit swagger on http://localhost:${PORT}/docs`);
});
