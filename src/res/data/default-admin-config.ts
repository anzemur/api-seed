import { RateLimitByType } from '../../config/types';

/**
 * Default admin configuration that is saved in database on first start.
 */
const defaultAdminConfig = {
  allowGoogleAuth: true,
  allowFacebookAuth: true,
  rateLimit: {
    limitBy: RateLimitByType.IP,
    maxPoints: 5,
    consumePoints: 1,
    duration: 10,
    blockDuration: 10,
    allowRateLimit: true,
  },
  cacheExpiration: 10,
  cachePerUser: true,
};

export default defaultAdminConfig;
