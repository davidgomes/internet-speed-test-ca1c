
import { serial, text, pgTable, timestamp, numeric, integer } from 'drizzle-orm/pg-core';

export const speedTestResultsTable = pgTable('speed_test_results', {
  id: serial('id').primaryKey(),
  download_speed: numeric('download_speed', { precision: 10, scale: 2 }).notNull(), // Mbps with 2 decimal precision
  upload_speed: numeric('upload_speed', { precision: 10, scale: 2 }).notNull(), // Mbps with 2 decimal precision
  ping: numeric('ping', { precision: 10, scale: 2 }).notNull(), // milliseconds with 2 decimal precision
  jitter: numeric('jitter', { precision: 10, scale: 2 }), // milliseconds, nullable
  test_server: text('test_server'), // Server location/name, nullable
  user_ip: text('user_ip'), // User's IP address, nullable
  user_agent: text('user_agent'), // Browser/client info, nullable
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript types for the table schema
export type SpeedTestResult = typeof speedTestResultsTable.$inferSelect;
export type NewSpeedTestResult = typeof speedTestResultsTable.$inferInsert;

// Export all tables for proper query building
export const tables = { speedTestResults: speedTestResultsTable };
