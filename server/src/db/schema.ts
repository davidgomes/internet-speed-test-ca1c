
import { serial, pgTable, timestamp, numeric } from 'drizzle-orm/pg-core';

export const speedTestsTable = pgTable('speed_tests', {
  id: serial('id').primaryKey(),
  download_speed: numeric('download_speed', { precision: 10, scale: 2 }).notNull(),
  upload_speed: numeric('upload_speed', { precision: 10, scale: 2 }).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// TypeScript types for the table schema
export type SpeedTest = typeof speedTestsTable.$inferSelect; // For SELECT operations
export type NewSpeedTest = typeof speedTestsTable.$inferInsert; // For INSERT operations

// Important: Export all tables and relations for proper query building
export const tables = { speedTests: speedTestsTable };
