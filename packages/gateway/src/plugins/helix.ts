import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  shouldRenderGraphiQL,
} from 'graphql-helix';
import { EOL } from 'os';
import {
  FastifyInstance,
  FastifyLoggerInstance,
} from 'fastify';
import { IncomingMessage, ServerResponse } from 'http';
import { envelop, useLogger, useSchema, useTiming } from '@envelop/core';
import { useDisableIntrospection } from '@envelop/disable-introspection';
import { Server } from 'https';
import { getBuiltMesh } from '../.mesh/index';

export default async (
  server: FastifyInstance<Server, IncomingMessage, ServerResponse, FastifyLoggerInstance>
): Promise<void> => {
  const { schema: meshSchema } = await getBuiltMesh();
  const isProduction = process.env.NODE_ENV = 'production';
  const disableIntrospection = false;

  server.route({
    method: ['GET', 'POST'],
    url: '/graphql',
    async handler(request, reply) {
      if (
        shouldRenderGraphiQL(request)
      ) {
        return reply
          .code(200)
          .type('text/html')
          .send(renderGraphiQL({
            defaultQuery: 'query StationsQuery {\n  v1_stations{\n    id\n		name\n  }\n}',
            headers: JSON.stringify(
              {
                'X-Client-Name': 'Website',
                'X-Auth-Token': 'an-auth-token',
              },
              null,
              4
            ),
          },));
      }

      const getEnveloped = envelop({
        plugins: [
          useSchema(meshSchema),
          ...(isProduction ? [useLogger()] : []),
          useTiming(),
          ...(disableIntrospection
            ? [useDisableIntrospection()]
            : []),
          ]
      })

      const { parse, validate, contextFactory, execute, schema } = getEnveloped({ request });
      const { operationName, query, variables } = getGraphQLParameters(request);

      const result = await processRequest({
        operationName,
        query: query || '',
        variables,
        request,
        schema,
        parse,
        validate,
        execute,
        contextFactory,
      });

      if (result.type === 'RESPONSE') {
        // support standard queries and mutations
        result.headers.forEach(({ name, value }) => reply.header(name, value));
        reply.status(result.status);
        reply.send(result.payload);
      } else if (result.type === 'PUSH') {
        // support Subscriptions
        reply.raw.writeHead(200, {
          'Content-Type': 'text/event-stream',
          Connection: 'keep-alive',
          'Cache-Control': 'no-cache',
        });

        request.raw.on('close', () => {
          result.unsubscribe();
        });

        await result.subscribe(resultData => {
          reply.raw.write(`data: ${JSON.stringify(resultData)}${EOL}${EOL}`);
        });
      } else {
        // support @stream and @defer directives
        reply.raw.writeHead(200, {
          Connection: 'keep-alive',
          'Content-Type': 'multipart/mixed; boundary="-"',
          'Transfer-Encoding': 'chunked',
        });

        request.raw.on('close', () => {
          result.unsubscribe();
        });

        await result.subscribe(resultData => {
          const chunk = Buffer.from(JSON.stringify(resultData), 'utf8');
          const data = [
            '',
            '---',
            'Content-Type: application/json; charset=utf-8',
            `Content-Length: ${String(chunk.length)}`,
            '',
            chunk,
            '',
          ];

          if (resultData.hasNext) {
            data.push('---');
          }

          reply.raw.write(data.join(EOL));
        });

        reply.raw.write(`${EOL}-----${EOL}`);
        reply.raw.end();
      }
      return reply;
    },
  });
};
