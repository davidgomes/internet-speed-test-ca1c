
import { z } from 'zod';

// Speed test result schema
export const speedTestResultSchema = z.object({
  id: z.number(),
  download_speed: z.number(), // Mbps
  upload_speed: z.number(), // Mbps
  ping: z.number(), // milliseconds
  jitter: z.number().nullable(), // milliseconds, can be null if not measured
  test_server: z.string().nullable(), // Server location/name
  user_ip: z.string().nullable(), // User's IP address
  user_agent: z.string().nullable(), // Browser/client info
  created_at: z.coerce.date()
});

export type SpeedTestResult = z.infer<typeof speedTestResultSchema>;

// Input schema for creating speed test results
export const createSpeedTestInputSchema = z.object({
  download_speed: z.number().nonnegative(),
  upload_speed: z.number().nonnegative(),
  ping: z.number().nonnegative(),
  jitter: z.number().nonnegative().nullable(),
  test_server: z.string().nullable(),
  user_ip: z.string().nullable(),
  user_agent: z.string().nullable()
});

export type CreateSpeedTestInput = z.infer<typeof createSpeedTestInputSchema>;

// Query schema for getting speed test history
export const getSpeedTestHistoryInputSchema = z.object({
  limit: z.number().int().min(1).max(100).optional().default(10),
  user_ip: z.string().optional()
});

export type GetSpeedTestHistoryInput = z.infer<typeof getSpeedTestHistoryInputSchema>;

// Speed test statistics schema
export const speedTestStatsSchema = z.object({
  avg_download_speed: z.number(),
  avg_upload_speed: z.number(),
  avg_ping: z.number(),
  total_tests: z.number(),
  fastest_download: z.number(),
  fastest_upload: z.number(),
  lowest_ping: z.number()
});

export type SpeedTestStats = z.infer<typeof speedTestStatsSchema>;
