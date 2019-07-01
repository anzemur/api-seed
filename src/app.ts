import express, { Application } from 'express';
import { Server } from 'http';
import mongoose, { Connection } from 'mongoose';
import { registerUsersRoutes } from './routes/users';
import { registerRootRoutes } from './routes/root';
import { handleErrors, handleNotFoundError } from './middleware/errors';
import { registerCors, registerBodyParsers } from './middleware/parsers';
import { registerContext } from './middleware/context';

/**
 * Base application instance.
 */
export class App {
  public app: Application;
  public server: Server;
  public mongooseConnection: Connection;
  public port: number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT || 3000);

    /**
     * Register parsers middleware.
     */
    registerCors(this.app);
    registerBodyParsers(this.app);

    /**
     * Register context middleware.
     */
    this.app.use(registerContext);

    /**
     * Register api routes.
     */

    registerRootRoutes(this.app);
    registerUsersRoutes(this.app);

    /**
     * Register api middleware.
     */
    this.app.use(handleNotFoundError);
    this.app.use(handleErrors);
  }

  /**
   * Starts HTTP server on given port.
   */
  public async listen() {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, resolve);
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
        resolve();
      });
    });
  }

  /**
   * Connects to database.
   */
  public async connectDb() {
    let connectionUri;
    if (process.env.ENV === 'dev') {
      connectionUri = `mongodb://${process.env.DB_HOST || 'localhost'}/${process.env.DB_NAME || 'straight-as-dev'}`;
    }
    if (process.env.ENV === 'production' || process.env.DB_TEST === 'test') {
      connectionUri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    }
    if (process.env.ENV === 'test') {
      connectionUri = `mongodb://${process.env.DB_TEST_USER}:${process.env.DB_TEST_PASS}@${process.env.DB_TEST_HOST}:${process.env.DB_TEST_PORT}/${process.env.DB_TEST_NAME}`;
    }
    this.mongooseConnection = mongoose.connection;

    /** 
     * Mongoose connection.
    **/
    this.mongooseConnection.on('connected', () => {
      console.log('MongoDb is connected on: ', connectionUri);
    });
    
    /**
     *  Mongoose error.
    **/
    this.mongooseConnection.on('error', (error) => {
      console.log('MongoDb encountered an error: ' + error);  
    });
      
    /**
     * Mongoose disconnected.
    **/
    this.mongooseConnection.on('disconnected', () => {
      console.log('MongoDb is disconnected.');
    });

    await mongoose.connect(connectionUri, { useNewUrlParser: true });
  }

  /**
   * Closes database connection.
   */
  public async closeDbConnection() {
    await this.mongooseConnection.close();
  }
}
