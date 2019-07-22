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
  public async getRequestCount(req: AuthRequest, res: AuthResponse, next: NextFunction) {

    try {
      const logs = await Log.aggregate([
        // {
        //   $match:  {
        //     'createdAt': {
        //       $lte: '2019-07-20T00:45:16.345+02:00',
        //       $gte: '2019-07-12T00:45:16.345+02:00',
        //     }
        //   }
        // },
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
        }
      ]);

      res.return(200, logs);
    } catch (error) {
      return next(new InternalServerError('There was a problem while getting logs.', error));
    }

  }
}
