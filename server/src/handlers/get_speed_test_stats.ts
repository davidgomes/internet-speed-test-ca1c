
import { db } from '../db';
import { speedTestsTable } from '../db/schema';
import { sql } from 'drizzle-orm';

export interface SpeedTestStats {
  total_tests: number;
  avg_download_speed: number;
  avg_upload_speed: number;
  max_download_speed: number;
  max_upload_speed: number;
  min_download_speed: number;
  min_upload_speed: number;
}

export const getSpeedTestStats = async (): Promise<SpeedTestStats> => {
  try {
    const result = await db.select({
      total_tests: sql<string>`count(*)`,
      avg_download_speed: sql<string>`avg(${speedTestsTable.download_speed})`,
      avg_upload_speed: sql<string>`avg(${speedTestsTable.upload_speed})`,
      max_download_speed: sql<string>`max(${speedTestsTable.download_speed})`,
      max_upload_speed: sql<string>`max(${speedTestsTable.upload_speed})`,
      min_download_speed: sql<string>`min(${speedTestsTable.download_speed})`,
      min_upload_speed: sql<string>`min(${speedTestsTable.upload_speed})`
    })
    .from(speedTestsTable)
    .execute();

    const stats = result[0];

    // Handle case where no tests exist
    const totalTests = parseInt(stats.total_tests);
    if (totalTests === 0) {
      return {
        total_tests: 0,
        avg_download_speed: 0,
        avg_upload_speed: 0,
        max_download_speed: 0,
        max_upload_speed: 0,
        min_download_speed: 0,
        min_upload_speed: 0
      };
    }

    // Convert all string values to numbers
    return {
      total_tests: totalTests,
      avg_download_speed: parseFloat(stats.avg_download_speed),
      avg_upload_speed: parseFloat(stats.avg_upload_speed),
      max_download_speed: parseFloat(stats.max_download_speed),
      max_upload_speed: parseFloat(stats.max_upload_speed),
      min_download_speed: parseFloat(stats.min_download_speed),
      min_upload_speed: parseFloat(stats.min_upload_speed)
    };
  } catch (error) {
    console.error('Speed test stats retrieval failed:', error);
    throw error;
  }
};
