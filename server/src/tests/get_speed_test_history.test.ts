
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { speedTestsTable } from '../db/schema';
import { getSpeedTestHistory } from '../handlers/get_speed_test_history';

describe('getSpeedTestHistory', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no speed tests exist', async () => {
    const result = await getSpeedTestHistory();
    expect(result).toEqual([]);
  });

  it('should return all speed tests ordered by creation date (newest first)', async () => {
    // Create multiple speed tests directly in database
    const speedTest1 = await db.insert(speedTestsTable)
      .values({
        download_speed: '100.50',
        upload_speed: '50.25'
      })
      .returning()
      .execute();

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const speedTest2 = await db.insert(speedTestsTable)
      .values({
        download_speed: '200.75',
        upload_speed: '75.50'
      })
      .returning()
      .execute();

    await new Promise(resolve => setTimeout(resolve, 10));
    
    const speedTest3 = await db.insert(speedTestsTable)
      .values({
        download_speed: '150.00',
        upload_speed: '60.00'
      })
      .returning()
      .execute();

    const result = await getSpeedTestHistory();

    // Should return 3 speed tests
    expect(result).toHaveLength(3);

    // Should be ordered by creation date (newest first)
    expect(result[0].id).toEqual(speedTest3[0].id);
    expect(result[1].id).toEqual(speedTest2[0].id);
    expect(result[2].id).toEqual(speedTest1[0].id);

    // Verify numeric fields are properly converted
    expect(typeof result[0].download_speed).toBe('number');
    expect(typeof result[0].upload_speed).toBe('number');
    expect(result[0].download_speed).toEqual(150.0);
    expect(result[0].upload_speed).toEqual(60.0);

    // Verify all fields are present
    result.forEach(speedTest => {
      expect(speedTest.id).toBeDefined();
      expect(speedTest.download_speed).toBeDefined();
      expect(speedTest.upload_speed).toBeDefined();
      expect(speedTest.created_at).toBeInstanceOf(Date);
    });
  });

  it('should handle single speed test correctly', async () => {
    const createdSpeedTest = await db.insert(speedTestsTable)
      .values({
        download_speed: '85.25',
        upload_speed: '42.75'
      })
      .returning()
      .execute();

    const result = await getSpeedTestHistory();

    expect(result).toHaveLength(1);
    expect(result[0].id).toEqual(createdSpeedTest[0].id);
    expect(result[0].download_speed).toEqual(85.25);
    expect(result[0].upload_speed).toEqual(42.75);
    expect(result[0].created_at).toBeInstanceOf(Date);
  });

  it('should maintain correct ordering with many speed tests', async () => {
    // Create 5 speed tests
    const speedTests = [];
    for (let i = 1; i <= 5; i++) {
      const speedTest = await db.insert(speedTestsTable)
        .values({
          download_speed: (i * 10).toString(),
          upload_speed: (i * 5).toString()
        })
        .returning()
        .execute();
      
      speedTests.push(speedTest[0]);
      
      // Small delay to ensure different timestamps
      if (i < 5) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    const result = await getSpeedTestHistory();

    expect(result).toHaveLength(5);

    // Should be in reverse order (newest first)
    for (let i = 0; i < 5; i++) {
      const expectedIndex = 4 - i; // Last created should be first
      expect(result[i].id).toEqual(speedTests[expectedIndex].id);
      expect(result[i].download_speed).toEqual((expectedIndex + 1) * 10);
      expect(result[i].upload_speed).toEqual((expectedIndex + 1) * 5);
    }
  });
});
