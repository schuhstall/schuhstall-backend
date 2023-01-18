import rateLimit from 'express-rate-limit';

/**
 * Ratelimiter for the specific request/controller. Can only strengthen, not weaken the restrictions
 * @param maxRate Amount of requests in the given timeframe
 * @param rateWindowInMS=60000 Timeframe[ms] in which the requests are counted.
 */
export const RateLimit = (
    maxRate: number,
    // default window is one minute
    rateWindowInMS: number = 60 * 1000,
) => {
    return rateLimit({
        windowMs: rateWindowInMS, // one minute in milliseconds
        max: maxRate,
        message: `RATE LIMIT: You have exceeded ${maxRate} requests in the last ${
            rateWindowInMS / 1000 / 60
        } minutes!`,
        // Since DO App platform uses a load balancer, we need to use the original IP of the request
        keyGenerator: (req) => req.get('do-connecting-ip') ?? req.ip
    });
};