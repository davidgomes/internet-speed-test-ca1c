
import { db } from '../db';
import { speedTestsTable } from '../db/schema';
import { type SpeedTest } from '../schema';
import { desc } from 'drizzle-orm';

export const getSpeedTestHistory = async (): Promise<SpeedTest[]> => {
  try {
    // Query all speed tests ordered by creation date (newest first)
    const results = await db.select()
      .from(speedTestsTable)
      .orderBy(desc(speedTestsTable.created_at))
      .execute();

    // Convert numeric fields back to numbers before returning
    return results.map(result => ({
      ...result,
      download_speed: parseFloat(result.download_speed),
      upload_speed: parseFloat(result.upload_speed)
    }));
  } catch (error) {
    console.error('Failed to get speed test history:', error);
    throw error;
  }
};
