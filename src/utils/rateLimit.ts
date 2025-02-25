import rateLimit from 'express-rate-limit';

const createRateLimiter = () => {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many requests, please try again later.',
  });
};

export default createRateLimiter;
