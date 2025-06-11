
import { db } from '../db';
import { speedTestsTable } from '../db/schema';
import { type CreateSpeedTestInput, type SpeedTest } from '../schema';

export const createSpeedTest = async (input: CreateSpeedTestInput): Promise<SpeedTest> => {
  try {
    // Insert speed test record
    const result = await db.insert(speedTestsTable)
      .values({
        download_speed: input.download_speed.toString(), // Convert number to string for numeric column
        upload_speed: input.upload_speed.toString() // Convert number to string for numeric column
      })
      .returning()
      .execute();

    // Convert numeric fields back to numbers before returning
    const speedTest = result[0];
    return {
      ...speedTest,
      download_speed: parseFloat(speedTest.download_speed), // Convert string back to number
      upload_speed: parseFloat(speedTest.upload_speed) // Convert string back to number
    };
  } catch (error) {
    console.error('Speed test creation failed:', error);
    throw error;
  }
};
