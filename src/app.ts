import express, { Application } from 'express';
import { Server } from 'http';
import mongoose, { Connection } from 'mongoose';
import { registerUsersRoutes } from './routes/users';
import { registerRootRoutes } from './routes/root';
import { handleErrors, handleNotFoundError } from './middleware/errors';
import { registerCors, registerBodyParsers, registerDeviceParsers, parseResponse } from './middleware/parsers';
import { registerContext } from './middleware/context';
import { RedisClient, createClient } from 'redis';
import { registerLogs } from './middleware/logs';
import { buildAdminConsoleNuxtApp } from './middleware/admin-console';
import { registerAuthRoutes } from './routes/auth';
import { registerFacebookAuth, registerGoogleAuth } from './config/passport';
import { registerAdminRoutes } from './routes/admin';
import { MongooseEvents, RedisEvents, EnvType } from './config/types';
import { registerAnalyticsRoutes } from './routes/analytics';
import env from './config/env';
import passport from 'passport';

/**
 * Base application instance.
 */
export class App {
  public app: Application;
  public server: Server;
  public mongooseConnection: Connection;
  public redisClient: RedisClient;
  public port: number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT || 3000);
  }

  /**
   * Registers applications routes and middleware.
   */
  public async registerRoutesAndMiddleware() {

    /** Register passport authentication strategies */
    if (env.FB_CLIENT_ID && env.FB_CLIENT_SECRET)
      await registerFacebookAuth();

    if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET)
      await registerGoogleAuth();

    this.app.use(passport.initialize());

    /* Register parsers middleware. */
    registerCors(this.app);
    registerBodyParsers(this.app);
    registerDeviceParsers(this.app);
    this.app.use(parseResponse);

    /* Register api middleware. */
    this.app.use(registerLogs);
    this.app.use(registerContext(this.mongooseConnection, this.redisClient));

    /* Register api routes. */
    registerRootRoutes(this.app);
    registerAuthRoutes(this.app);
    registerUsersRoutes(this.app);
    registerAdminRoutes(this.app);
    registerAnalyticsRoutes(this.app);

    /* Register admin console app middleware. */
    if (env.USE_ADMIN_CONSOLE) 
      await buildAdminConsoleNuxtApp(this.app);

    /* Register api errors middleware. */
    this.app.use(handleNotFoundError);
    this.app.use(handleErrors);
  }

  async initAdminConfig() {
    
  }

  /**
   * Starts server on given port.
   */
  public async listen() {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, resolve);
      console.log(`│ Server listening on port: ${this.port}.`);
    });
  }

  /**
   * Stops the server.
   */
  public async close() {
    return new Promise((resolve, reject) => {
      this.server.close(err => {
        if (err) {
          return reject(err);
        }
        this.server = null;
        resolve();
      });
    });
  }

  /**
   * Connects to database.
   */
  public async connectDb() {
    let connectionUri: string;
    if (process.env.ENV === EnvType.DEV) {
      connectionUri = `mongodb://${process.env.DB_HOST || 'localhost'}/${process.env.DB_NAME || 'api-seed-dev'}`;
    }
    if (process.env.ENV === EnvType.TEST) {
      connectionUri = `mongodb://${process.env.TEST_DB_HOST || 'localhost'}/${process.env.TEST_DB_NAME || 'api-seed-test'}`;
    }
    this.mongooseConnection = mongoose.connection;

    /* Mongoose connection. */
    this.mongooseConnection.on(MongooseEvents.CONNECTED, () => {
      console.log('│ MongoDb is connected on: ', connectionUri);
    });

    /* Mongoose error. */
    this.mongooseConnection.on(MongooseEvents.ERROR, (error) => {
      console.log('│ MongoDb encountered an error: ' + error);
    });

    /* Mongoose disconnected.*/
    this.mongooseConnection.on(MongooseEvents.DISCONNECTED, () => {
      console.log('│ MongoDb is disconnected.');
    });

    await mongoose.connect(connectionUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
  }

  /**
   * Closes database connection.
   */
  public async closeDbConnection() {
    await this.mongooseConnection.close();
  }

  /**
   * Creates new Redis client connection.
   */
  public async createRedisClient() {
    this.redisClient = await createClient({
      enable_offline_queue: false,
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT)
    });

    this.redisClient.on(RedisEvents.CONNECT, () => {
      console.log(`│ Redis DB is connected on: ${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`);
    });

    this.redisClient.on(RedisEvents.ERROR, (error) => {
      console.log('│ Redis DB encountered an error: ' + error);
    });

    this.redisClient.on(RedisEvents.END, (error) => {
      console.log('│ Redis DB is disconnected.');
    });
  }

  /**
   * Closes Redis client connection.
   */
  public async closeRedisClient() {
    await this.redisClient.quit();
  }
}
