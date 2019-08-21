import * as winston from 'winston';
import moment from 'moment';
import { LoggerLevels } from '../config/types';

/**
 * Base service class.
 */
export abstract class Service {

  /* Service name property definition. */
  readonly name: string;

  /* Logger instance property definition. */
  readonly logger: winston.Logger;

  constructor(name: string) {
    this.name = name;

    this.logger = winston.createLogger({
      level: LoggerLevels.info,
      format: winston.format.json(),
      defaultMeta: { Service: this.name },
      transports: [
        new winston.transports.File({ filename: `logs/${moment().format('MM-DD-YYYY')}-error.log`, level: LoggerLevels.error }),
        new winston.transports.File({ filename: `logs/${moment().format('MM-DD-YYYY')}-all.log` })
      ]
    });
  }
}
