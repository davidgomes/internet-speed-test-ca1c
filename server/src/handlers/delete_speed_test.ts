
import { db } from '../db';
import { speedTestsTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export const deleteSpeedTest = async (id: number): Promise<boolean> => {
  try {
    const result = await db.delete(speedTestsTable)
      .where(eq(speedTestsTable.id, id))
      .returning()
      .execute();

    return result.length > 0;
  } catch (error) {
    console.error('Speed test deletion failed:', error);
    throw error;
  }
};
