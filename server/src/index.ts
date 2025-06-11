
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';
import { createSpeedTestInputSchema } from './schema';
import { createSpeedTest } from './handlers/create_speed_test';
import { getLatestSpeedTest } from './handlers/get_latest_speed_test';
import { downloadTest } from './handlers/download_test';
import { uploadTest } from './handlers/upload_test';

// Internet Speed Test Application
// Provides API endpoints for measuring and storing network speed test results

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  createSpeedTest: publicProcedure
    .input(createSpeedTestInputSchema)
    .mutation(({ input }) => createSpeedTest(input)),
  getLatestSpeedTest: publicProcedure
    .query(() => getLatestSpeedTest()),
  downloadTest: publicProcedure
    .input(z.object({ size: z.number().int().positive() }))
    .query(({ input }) => downloadTest(input.size)),
  uploadTest: publicProcedure
    .input(z.object({ data: z.string() }))
    .mutation(({ input }) => uploadTest(input.data)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
