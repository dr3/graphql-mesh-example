import { FastifyPluginCallback, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyRequest {
    clientName: string;
    authToken: string;
  }
}

type Header = string | undefined;

const headersPlugin: FastifyPluginCallback = (fastify, opts, pluginDone) => {
  fastify.addHook(
    'preHandler',
    (req: FastifyRequest, _, done) => {
      const clientName = req.headers['x-client-name'] as Header;
      const authToken = req.headers['x-auth-token'] as Header;

      if (clientName) req.clientName = clientName;
      if (authToken) req.authToken = authToken;

      done();
    }
  );

  pluginDone();
};

export default fp(headersPlugin, {
  name: 'headers',
});
