
import { z } from 'zod';

// Speed test schema with proper numeric handling
export const speedTestSchema = z.object({
  id: z.number(),
  download_speed: z.number(),
  upload_speed: z.number(),
  created_at: z.coerce.date() // Automatically converts string timestamps to Date objects
});

export type SpeedTest = z.infer<typeof speedTestSchema>;

// Input schema for creating speed tests
export const createSpeedTestInputSchema = z.object({
  download_speed: z.number().positive(), // Validate that download speed is positive
  upload_speed: z.number().positive() // Validate that upload speed is positive
});

export type CreateSpeedTestInput = z.infer<typeof createSpeedTestInputSchema>;
