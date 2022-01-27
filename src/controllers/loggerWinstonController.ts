import winston from 'winston';

//////////// WINSTON LOGGER ////////////

export const consoleLogger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console({})],
});

export const errorLogger = winston.createLogger({
  level: 'error',
  transports: [
    new winston.transports.File({
      filename: 'error.log',
    }),
  ],
});

export const warnLogger = winston.createLogger({
  level: 'warn',
  transports: [
    new winston.transports.File({
      filename: 'warn.log',
    }),
  ],
});

export default { consoleLogger, errorLogger, warnLogger };
