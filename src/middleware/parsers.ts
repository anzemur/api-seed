import { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import device from 'express-device';

/**
 * Registers CORS middleware.
 * @param app Application instance.
 */
export function registerCors(app: Application) {
  app.use(cors());
}

/**
 * Registers requests body parser middleware.
 * @param app Application instance.
 */
export function registerBodyParsers(app: Application) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
}

/**
 * Registers client device parser middleware.
 * @param app Application instance.
 */
export function registerDeviceParsers(app: Application) {
  app.use(device.capture());
}

