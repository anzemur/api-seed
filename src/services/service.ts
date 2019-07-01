import * as winston from 'winston';

/**
 * Base service class.
 */
export abstract class Service {

  /**
   * Service name property definition.
   */
  name: string;

  /**
   * Logger instance property definition.
   */
  logger: winston.Logger;

  constructor(name: string) {
    this.name = name;

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { service: this.name },
      transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/all.log' })
      ]
    });
  }
}
