import path from 'path';

export default ({ env }) => {
  const client = env('DATABASE_CLIENT', 'mysql');
  const host = env('DB_LOCAL_HOST', env('DATABASE_HOST', 'localhost'));
  const port = env.int('DB_LOCAL_PORT', env.int('DATABASE_PORT', 33306));

  const connections = {
    mysql: {
      connection: {
        host,
        port,
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool(
            'DATABASE_SSL_REJECT_UNAUTHORIZED',
            true
          ),
        },
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        connectTimeout: env.int('DATABASE_CONNECT_TIMEOUT', 10000), // 10 seconds
        charset: 'utf8mb4',
      },
      pool: { 
        min: env.int('DATABASE_POOL_MIN', 2),
        max: env.int('DATABASE_POOL_MAX', 10),
        idleTimeoutMillis: env.int('DATABASE_IDLE_TIMEOUT', 30000), // 30 seconds (reduced from 5 minutes)
        acquireTimeoutMillis: env.int('DATABASE_CONNECTION_TIMEOUT', 10000), // 10 seconds (reduced from 60 seconds)
        createTimeoutMillis: env.int('DATABASE_CREATE_TIMEOUT', 10000), // 10 seconds
        destroyTimeoutMillis: env.int('DATABASE_DESTROY_TIMEOUT', 5000), // 5 seconds
        // verify each new socket before use
        afterCreate: (conn, done) => {
          conn.ping(err => {
            if (err) {
              console.error('🔌 Database connection ping failed:', err);
            }
            done(err, conn);
          });
        },
        // Handle connection validation
        validate: (conn) => {
          return conn && conn.state !== 'disconnected';
        },
      },
    },
    postgres: {
      connection: {
        connectionString: env('DATABASE_URL'),
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl: env.bool('DATABASE_SSL', false) && {
          key: env('DATABASE_SSL_KEY', undefined),
          cert: env('DATABASE_SSL_CERT', undefined),
          ca: env('DATABASE_SSL_CA', undefined),
          capath: env('DATABASE_SSL_CAPATH', undefined),
          cipher: env('DATABASE_SSL_CIPHER', undefined),
          rejectUnauthorized: env.bool(
            'DATABASE_SSL_REJECT_UNAUTHORIZED',
            true
          ),
        },
        schema: env('DATABASE_SCHEMA', 'public'),
      },
      pool: { min: env.int('DATABASE_POOL_MIN', 2), max: env.int('DATABASE_POOL_MAX', 10) },
    },
    sqlite: {
      connection: {
        filename: path.join(
          __dirname,
          '..',
          '..',
          env('DATABASE_FILENAME', '.tmp/data.db')
        ),
      },
      useNullAsDefault: true,
    },
  };

  return {
    connection: {
      client,
      ...connections[client],
      acquireConnectionTimeout: env.int('DATABASE_CONNECTION_TIMEOUT', 10000), // Reduced from 60 seconds to 10 seconds
    },
    // Add debugging for connection issues
    debug: env.bool('DATABASE_DEBUG', false),
  };
};
