import rateLimit from 'express-rate-limit';
import {config} from './configs/config.js';

export const requestLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 requests por ventana de tiempo por IP
    message: {
        success: false,
        message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
        error: 'RATE_LIMIT_EXCEEDED',
    },
    standardHeaders: true, // Retorna rate limit info en los headers `RateLimit-*`
    legacyHeaders: false, // Desactiva los headers `X-RateLimit-*`
    handler: (req, res) => {
        console.log(`Rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
        res.status(429).json({
            success: false,
            message:
                'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
            error: 'RATE_LIMIT_EXCEEDED',
            retryAfter: Math.round((req.rateLimit.resetTime - Date.now()) / 1000),
        });
    },
});

// Rate limiter específico para endpoints de autenticación
export const authRateLimit = rateLimit({
  windowMs: config.rateLimit.authWindowMs,
  max: config.rateLimit.authMaxRequests,
  message: {
    success: false,
    message:
      'Demasiados intentos de autenticación, intenta de nuevo más tarde.',
    retryAfter: Math.ceil(config.rateLimit.authWindowMs / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`Rate limit exceeded for IP: ${req.ip} on ${req.path}`);
    res.status(429).json({
      success: false,
      message:
        'Demasiados intentos de autenticación, intenta de nuevo más tarde.',
      retryAfter: Math.ceil(config.rateLimit.authWindowMs / 1000),
    });
  },
});

// Rate limiter para email endpoints (más restrictivo pero más razonable)
export const emailRateLimit = rateLimit({
  windowMs: config.rateLimit.emailWindowMs, // 15 minutos
  max: config.rateLimit.emailMaxRequests, // máximo 3 emails por 15 minutos
  message: {
    success: false,
    message: 'Demasiados emails enviados, intenta de nuevo en 15 minutos.',
    retryAfter: Math.ceil(config.rateLimit.emailWindowMs / 1000),
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`Email rate limit exceeded for: ${req.body.email || req.ip}`);
    res.status(429).json({
      success: false,
      message: 'Demasiados emails enviados, intenta de nuevo en 15 minutos.',
      retryAfter: Math.ceil(config.rateLimit.emailWindowMs / 1000),
    });
  },
});