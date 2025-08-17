import { Elysia } from 'elysia';
import { lessonRoutes } from './modules/lesson/routes';
import { profileRoutes } from './modules/profile/routes';
import { config } from './config';
import { swagger } from '@elysiajs/swagger';
import { BaseError } from './utils/error';
import { cors } from '@elysiajs/cors';

export const app = new Elysia()
  .use(
    cors({
      origin: config.CORS_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )
  .use(
    swagger({
      path: '/docs',
      documentation: {
        info: {
          title: 'Fokusdonk API',
          description: 'API documentation for Fokusdonk application',
          version: '1.0.0',
        },
      },
    })
  )
  .error({
    CUSTOM: BaseError,
  })
  .onError(({ error, code, set }) => {
    set.headers = {
      'content-type': 'application/json',
    };

    if (code === 'CUSTOM') return error;
    if (code === 'VALIDATION') {
      set.status = 400;
      const firstErr = error.validator.Errors(error.value).First();
      const path = firstErr.path.replace('/', '');
      const value = firstErr.value;
      const msg = firstErr.message;
      return {
        name: 'ValidationError',
        messsage: `Validation failed for ${path} with value ${value}: ${msg}`,
      };
    }

    if (code === 'NOT_FOUND') {
      set.status = 404;
      return {
        name: 'NotFoundError',
        message: 'The requested resource was not found',
      };
    }

    set.status = 500;
    console.log('Internal Server Error: ', error);
    return {
      name: 'InternalServerError',
      message: 'An unexpected error occurred',
    };
  })
  .use(lessonRoutes)
  .use(profileRoutes)
  .get('/', () => 'Hello Fokusdonk!')
  .listen(config.PORT);

app.on('error', (error) => {
  console.error('Server error:', error);
});

console.log('Server is running on http://localhost:3000');
