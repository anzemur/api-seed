import { Controller } from './ctrl';
import { boundMethod } from 'autobind-decorator';
import { AuthRequest, AuthResponse } from '../middleware/authentication';
import { NextFunction } from 'connect';
import { Log } from '../models/log-model';
import { InternalServerError } from '../lib/errors';

/**
 * Analytics controller.
 */
export class AnalyticsController extends Controller {

  constructor() {
    super();
  }

  @boundMethod
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

    res.return(200, logs);
    } catch (error) {
      return next(new InternalServerError('There was a problem while getting logs.', error));
    }

  }

  @boundMethod
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
    res.return(200, logs);
    } catch (error) {
      return next(new InternalServerError('There was a problem while getting logs.', error));
    }
  }

  @boundMethod
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

    res.return(200, logs);
    } catch (error) {
      return next(new InternalServerError('There was a problem while getting logs.', error));
    }
  }

  @boundMethod
  public async getRequests(req: AuthRequest, res: AuthResponse, next: NextFunction) {
    const query = req.query;

    query.limit = query.limit || 25;
    query.page = query.page || 0;

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

      res.return(200, logs, {
        totalRecords: count,
        page        : query.page,
        totalPages  : Math.ceil(count / query.limit),
        perPage     : query.limit
      });
    } catch (error) {
      return next(new InternalServerError('There was a problem while getting logs.', error));
    }
  }

  @boundMethod
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

      res.return(200, logs);
    } catch (error) {
      return next(new InternalServerError('There was a problem while getting logs.', error));
    }

  }
}
