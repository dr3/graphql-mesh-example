import fastify from 'fastify';
import headerPlugin from './plugins/header'
import helixPlugin from './plugins/helix';

const start = async () => {
  const server = fastify();
  server.register(headerPlugin);
  server.register(helixPlugin as any);
  await server.listen('3002');
  console.log(`Graphql Gateway is running at http://localhost:3002`);
  console.log(`Graphiql at http://localhost:3002/graphql`);
};

start();
