import dotenv from 'dotenv';

dotenv.config();

const winston = require('winston');

// Log Levels
//   error:   0
//   warn:    1
//   info:    2
//   http:    3
//   verbose: 4
//   debug:   5
//   silly:   6

const logger = winston.createLogger({
    format:
        process.env.NODE_ENV === 'production'
            ? winston.format.json()
            : winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            ),
    level: 'silly',
    silent: process.env.SILENT_LOGS,
    transports:
        process.env.NODE_ENV === 'production'
            ? [
                new winston.transports.Console(),
                // custom production logging
            ]
            : [new winston.transports.Console()],
});

export default logger;