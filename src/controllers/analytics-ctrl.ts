import { Controller } from './ctrl';
import { boundMethod as BoundMethod } from 'autobind-decorator';
import { AuthRequest, AuthResponse } from '../middleware/authentication';
import { NextFunction } from 'connect';
import { Log } from '../models/log-mod';
import { InternalServerError } from '../lib/errors';
import * as os from 'os';
import { formatApplicationUptime } from '../lib/parsers';
import { HttpStatusCodes } from '../config/http-status-codes';

/**
 * Analytics controller.
 */
export class AnalyticsController extends Controller {

  constructor() {
    super(AnalyticsController.name);
  }

  /**
   * Returns list of devices counts.
   */
  @BoundMethod
  public async getRequestDevicesCount(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const query = req.query;

    try {
      const logs = await Log.aggregate([
        {
          $match:  {
            ...(query.startTime && query.endTime) ? 
            {
              'createdAt': {
                $lte: query.endTime,
                $gte: query.startTime,
              }
            } : {},
          }
        },
        {
          $group: {
              _id: { clientDevice: '$clientDevice' },
              count: {
                $sum: 1
              }
          }
        },
        {
          $project: {
            clientDevice: '$_id.clientDevice',
            count: '$count',
            _id: 0,
          }
        },
        { $sort : { count: 1 } },
      ]);

      res.return(HttpStatusCodes.OK, logs);
    } catch (error) {
      return next(new InternalServerError('There was a problem while getting logs.', error));
    }
  }

  /**
   * Returns list of requests counts.
   */
  @BoundMethod
  public async getRequestsCount(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const query = req.query;

    try {
      const logs = await Log.aggregate([
        {
          $match:  {
            $and: [
              { ...(query.startTime && query.endTime) ? 
                {
                  createdAt: {
                    $lte: query.endTime,
                    $gte: query.startTime,
                  }
                } : {},
              },
              { statusCode: { $ne: 404} }
            ]
          }
        },
        {
          $group: {
              _id: { requestUrl: '$requestUrl' },
              count: {
                $sum: 1
              }
          }
        },
        {
          $project: {
            requestUrl: '$_id.requestUrl',
            count: '$count',
            _id: 0,
          }
        },
        { $sort : { count: 1 } },
      ]).then((unfilteredLogs) => unfilteredLogs.filter((log) => !(
        log.requestUrl.startsWith('/admin') ||
        log.requestUrl.startsWith('/_nuxt') ||
        log.requestUrl.startsWith('/dist') ||
        log.requestUrl.startsWith('/favicon') ||
        log.requestUrl.startsWith('/api/v1/admin/') ||
        log.requestUrl.startsWith('/api/v1/analytics/')
      )));
      res.return(HttpStatusCodes.OK, logs);
    } catch (error) {
      return next(new InternalServerError('There was a problem while getting logs.', error));
    }
  }

  /**
   * Returns list of requests response times.
   */
  @BoundMethod
  public async getRequestsResponseTimes(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const query = req.query;

    try {
      const logs = await Log.aggregate([
        {
          $match:  {
            $and: [
              { ...(query.startTime && query.endTime) ? 
                {
                  createdAt: {
                    $lte: query.endTime,
                    $gte: query.startTime,
                  }
                } : {},
              },
              { statusCode: { $ne: 404} }
            ]
          }
        },
        {
          $group: {
            _id: { requestUrl: '$requestUrl' },
            responseTime: { $avg: '$responseTime' }
          }
        },
        {
          $project: {
            requestUrl: '$_id.requestUrl',
            responseTime: '$responseTime',
            _id: 0,
          }
        },
        { $sort : { responseTime: 1 } },
      ]).then((unfilteredLogs) => unfilteredLogs.filter((log) => !(
        log.requestUrl.startsWith('/admin') ||
        log.requestUrl.startsWith('/_nuxt') ||
        log.requestUrl.startsWith('/dist') ||
        log.requestUrl.startsWith('/favicon') ||
        log.requestUrl.startsWith('/api/v1/admin/') ||
        log.requestUrl.startsWith('/api/v1/analytics/')
      )));

      res.return(HttpStatusCodes.OK, logs);
    } catch (error) {
      return next(new InternalServerError('There was a problem while getting logs.', error));
    }
  }

  /**
   * Returns paginated list of requests.
   */
  @BoundMethod
  public async getRequests(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const query = req.query;

    query.limit = query.limit ? Number(query.limit) : 25;
    query.page = query.page ? Number(query.page) : 0;

    const $match = {
      $and: [
        { ...(query.statusCode && !isNaN(query.statusCode) ? { statusCode: Number(query.statusCode) } : {}) },
        { ...(query.method ? { method: query.method } : {}) },
        { ...(query.requestUrl ? { requestUrl: query.requestUrl } : {}) },
        { ...(query.userId ? { userId: query.userId } : {}) },
      ],
    };
    
    try {
      const logs = await Log.aggregate([
        { $match },
        { $sort : { createdAt : -1 } },
        { $limit: query.limit * query.page  + query.limit },
        { $skip: query.limit * query.page },
      ]);
      const count = await Log.countDocuments($match);

      res.return(HttpStatusCodes.OK, logs, {
        totalRecords: count,
        page        : query.page,
        totalPages  : Math.ceil(count / query.limit),
        perPage     : query.limit
      });
    } catch (error) {
      return next(new InternalServerError('There was a problem while getting logs.', error));
    }
  }

  /**
   * Returns list of daily requests count.
   */
  @BoundMethod
  public async getDailyRequestCount(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const query = req.query;
    
    try {
      const logs = await Log.aggregate([
        {
          $match:  {
            ...(query.startTime && query.endTime) ? 
            {
              'createdAt': {
                $lte: query.endTime,
                $gte: query.startTime,
              }
            } : {},
          }
        },
        {
          $group: {
            _id: {
              day: { $dayOfMonth: '$createdAt' },
              month: { $month: '$createdAt' }, 
              year: { $year: '$createdAt' }
            }, 
            count: { $sum: 1 },
            date: { $first: '$createdAt' }
          }
        },
        {
          $project: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
            count: 1,
            _id: 0
          }
        },
        {
          $sort : { date : 1 }
        }
      ]);

      res.return(HttpStatusCodes.OK, logs);
    } catch (error) {
      return next(new InternalServerError('There was a problem while getting logs.', error));
    }
  }

  /**
   * Returns server and database information.
   */
  @BoundMethod
  public async getServerInfo(req: AuthRequest, res: AuthResponse, next: NextFunction) {

    req.context.mongooseConnection.db.stats((err, mongoStats) => {
      res.return(HttpStatusCodes.OK, {
        ...process.memoryUsage(),
        mongoStats,
        formattedRss: Math.round(process.memoryUsage().rss / 1024 / 1024 * 100) / 100,
        formattedHeapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
        formattedExternal: Math.round(process.memoryUsage().external / 1024 / 1024 * 100) / 100,
        formattedHeapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
        freeMemory: os.freemem(),
        totalMemory: os.totalmem(),
        formattedFreeMemory: Math.round(os.freemem() / 1024 / 1024 * 100) / 100,
        formattedTotalMemory: Math.round(os.totalmem() / 1024 / 1024 * 100) / 100,
        cpus: os.cpus(),
        osType: os.type(),
        osRelease: os.release(),
        formattedUptime: formatApplicationUptime(process.uptime()),
        uptime: process.uptime()
      });
    });
  }
}
