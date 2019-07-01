import { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

/**
 * Registers CORS middleware.
 * @param app Application instance.
 */
export function registerCors(app: Application) {
  app.use(cors());
}

/**
 * Registers requests body parsers middleware.
 * @param app Application instance.
 */
export function registerBodyParsers(app: Application) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
}

