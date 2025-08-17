import { t, getSchemaValidator } from 'elysia';

const configSchema = t.Object({
  PORT: t.Integer({
    description: 'Port on which the server will run',
    example: 3000,
  }),
  DATABASE_URL: t.String({
    description: 'Database connection string',
    example: 'postgresql://user:password@localhost:5432/mydb',
    error: 'DATABASE_URL is required',
  }),
  REDIS_URL: t.Optional(
    t.String({
      description: 'Redis connection string',
      example: 'redis://localhost:6379',
      error:
        'REDIS_URL is optional but should be a valid Redis URL if provided',
    })
  ),
  NODE_ENV: t.Union(
    [
      t.Literal('development'),
      t.Literal('test'),
      t.Literal('staging'),
      t.Literal('production'),
    ],
    {
      description: 'Environment in which the application is running',
      example: 'development',
      error:
        'NODE_ENV must be either "development", "test", "staging", or "production"',
    }
  ),

  CORS_ORIGIN: t.Optional(
    t.Array(
      t.String({
        description: 'List of allowed origins for CORS requests',
        example: 'http://localhost:8080',
      }),
      {
        description: 'CORS allowed origins',
        error: 'CORS_ORIGIN must be an array of valid URLs',
      }
    )
  ),
});

const config = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV || 'development',
  REDIS_URL: process.env.REDIS_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((url) => url.trim())
    : ['http://localhost:8080'],
};

const validateConfig = getSchemaValidator(configSchema);
const configErrs = validateConfig.Errors(config).First();

if (configErrs) {
  console.log('Configuration errors: ');
  console.log(configErrs);
  process.exit(1);
} else {
  console.log('Configuration is valid');
  console.log(`Server will run on port: ${config.PORT}`);
  console.log(`Database URL: ${config.DATABASE_URL}`);
  // if (config.NODE_ENV === 'development') {
  // }
}

export { config };
