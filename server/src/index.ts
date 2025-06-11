
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

import { 
  createSpeedTestInputSchema, 
  getSpeedTestHistoryInputSchema 
} from './schema';
import { createSpeedTest } from './handlers/create_speed_test';
import { getSpeedTestHistory } from './handlers/get_speed_test_history';
import { getLatestSpeedTest } from './handlers/get_latest_speed_test';
import { getSpeedTestStats } from './handlers/get_speed_test_stats';
import { deleteSpeedTest } from './handlers/delete_speed_test';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),
  
  // Create a new speed test result
  createSpeedTest: publicProcedure
    .input(createSpeedTestInputSchema)
    .mutation(({ input }) => createSpeedTest(input)),
  
  // Get speed test history with optional filters
  getSpeedTestHistory: publicProcedure
    .input(getSpeedTestHistoryInputSchema.optional())
    .query(({ input }) => getSpeedTestHistory(input)),
  
  // Get the latest speed test result
  getLatestSpeedTest: publicProcedure
    .query(() => getLatestSpeedTest()),
  
  // Get speed test statistics (averages, totals, etc.)
  getSpeedTestStats: publicProcedure
    .query(() => getSpeedTestStats()),
  
  // Delete a specific speed test result
  deleteSpeedTest: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteSpeedTest(input.id)),
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
