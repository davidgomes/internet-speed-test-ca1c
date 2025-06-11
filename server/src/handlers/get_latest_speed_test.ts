
import { db } from '../db';
import { speedTestsTable } from '../db/schema';
import { type SpeedTest } from '../schema';
import { desc } from 'drizzle-orm';

export const getLatestSpeedTest = async (): Promise<SpeedTest | null> => {
  try {
    // Query for the latest speed test, ordered by created_at descending
    const results = await db.select()
      .from(speedTestsTable)
      .orderBy(desc(speedTestsTable.created_at))
      .limit(1)
      .execute();

    // Return null if no speed tests exist
    if (results.length === 0) {
      return null;
    }

    // Convert numeric fields back to numbers before returning
    const speedTest = results[0];
    return {
      ...speedTest,
      download_speed: parseFloat(speedTest.download_speed),
      upload_speed: parseFloat(speedTest.upload_speed)
    };
  } catch (error) {
    console.error('Failed to get latest speed test:', error);
    throw error;
  }
};
