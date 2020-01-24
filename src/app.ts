import env from './config/env';
import defaultAdminConfig from './res/data/default-admin-config';
import passport from 'passport';import express, { Application } from 'express';
import mongoose, { Connection } from 'mongoose';
import { Server } from 'http';
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
import { AdminService } from './services/admin-service';

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
    if (env.USE_ADMIN_CONSOLE && process.env.ENV !== EnvType.TEST) {
      await buildAdminConsoleNuxtApp(this.app);
    }

    /* Register api errors middleware. */
    this.app.use(handleNotFoundError);
    this.app.use(handleErrors);

    console.log(`│ Routes and middleware registered.`);
  }

  /**
   * Checks if admin config exist, and if it doesn't creates new one.
   */
  async initAdminConfig() {
    const adminService = new AdminService();
    const { config, error } = await adminService.getAdminConfig();
    if (error && !config) {
      await adminService.createAdminConfig(defaultAdminConfig);
      console.log(`│ Admin config created.`);
    } else if (config) {
      console.log(`│ Admin config loaded.`);
    }
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
      this.server.close(error => {
        if (error) {
          return reject(error);
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
    switch (process.env.ENV) {
      case EnvType.DEV:
        connectionUri = `mongodb://${process.env.DB_HOST || 'localhost'}/${process.env.DB_NAME || 'api-seed-dev'}`;
        break;

      case EnvType.PRODUCTION:
        connectionUri = `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`;
        break;

      case EnvType.TEST:
        connectionUri = `mongodb://${process.env.TEST_DB_HOST || 'localhost'}/${process.env.TEST_DB_NAME || 'api-seed-test'}`;
        break;

      default:
        break;
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
