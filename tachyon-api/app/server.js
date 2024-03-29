const fastify = require('fastify')({ logger: true });
fastify.register(require('@fastify/postgres'), {
  connectionString: `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_SERVICE}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`,
});
fastify.register(require('./routes'));

// Run the server
const start = () => {
  fastify.listen({port: 3000, host: '0.0.0.0' }, err => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });
};
start();