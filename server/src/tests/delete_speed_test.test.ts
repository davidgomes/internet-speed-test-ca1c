
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { speedTestsTable } from '../db/schema';
import { deleteSpeedTest } from '../handlers/delete_speed_test';
import { eq } from 'drizzle-orm';

describe('deleteSpeedTest', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should delete an existing speed test', async () => {
    // Create a speed test directly using database insert
    const insertResult = await db.insert(speedTestsTable)
      .values({
        download_speed: '100.50',
        upload_speed: '50.25'
      })
      .returning()
      .execute();
    
    const createdId = insertResult[0].id;
    
    // Delete the speed test
    const result = await deleteSpeedTest(createdId);
    
    expect(result).toBe(true);
    
    // Verify it's deleted from database
    const speedTests = await db.select()
      .from(speedTestsTable)
      .where(eq(speedTestsTable.id, createdId))
      .execute();
    
    expect(speedTests).toHaveLength(0);
  });

  it('should return false when deleting non-existent speed test', async () => {
    const result = await deleteSpeedTest(999);
    
    expect(result).toBe(false);
  });

  it('should not affect other speed tests when deleting one', async () => {
    // Create multiple speed tests directly
    const insertResult1 = await db.insert(speedTestsTable)
      .values({
        download_speed: '100.50',
        upload_speed: '50.25'
      })
      .returning()
      .execute();
    
    const insertResult2 = await db.insert(speedTestsTable)
      .values({
        download_speed: '200.00',
        upload_speed: '100.00'
      })
      .returning()
      .execute();
    
    const speedTest1Id = insertResult1[0].id;
    const speedTest2Id = insertResult2[0].id;
    
    // Delete one speed test
    const result = await deleteSpeedTest(speedTest1Id);
    
    expect(result).toBe(true);
    
    // Verify the other speed test still exists
    const remainingTests = await db.select()
      .from(speedTestsTable)
      .where(eq(speedTestsTable.id, speedTest2Id))
      .execute();
    
    expect(remainingTests).toHaveLength(1);
    expect(remainingTests[0].id).toBe(speedTest2Id);
  });
});
