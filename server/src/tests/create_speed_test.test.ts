
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { speedTestsTable } from '../db/schema';
import { type CreateSpeedTestInput } from '../schema';
import { createSpeedTest } from '../handlers/create_speed_test';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateSpeedTestInput = {
  download_speed: 100.5,
  upload_speed: 50.25
};

describe('createSpeedTest', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a speed test', async () => {
    const result = await createSpeedTest(testInput);

    // Basic field validation
    expect(result.download_speed).toEqual(100.5);
    expect(result.upload_speed).toEqual(50.25);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(typeof result.download_speed).toBe('number');
    expect(typeof result.upload_speed).toBe('number');
  });

  it('should save speed test to database', async () => {
    const result = await createSpeedTest(testInput);

    // Query using proper drizzle syntax
    const speedTests = await db.select()
      .from(speedTestsTable)
      .where(eq(speedTestsTable.id, result.id))
      .execute();

    expect(speedTests).toHaveLength(1);
    expect(parseFloat(speedTests[0].download_speed)).toEqual(100.5);
    expect(parseFloat(speedTests[0].upload_speed)).toEqual(50.25);
    expect(speedTests[0].created_at).toBeInstanceOf(Date);
  });

  it('should handle decimal precision correctly', async () => {
    const preciseInput: CreateSpeedTestInput = {
      download_speed: 123.45, // Using 2 decimal places to match schema precision
      upload_speed: 67.89
    };

    const result = await createSpeedTest(preciseInput);

    expect(result.download_speed).toEqual(123.45);
    expect(result.upload_speed).toEqual(67.89);

    // Verify in database
    const speedTests = await db.select()
      .from(speedTestsTable)
      .where(eq(speedTestsTable.id, result.id))
      .execute();

    expect(parseFloat(speedTests[0].download_speed)).toEqual(123.45);
    expect(parseFloat(speedTests[0].upload_speed)).toEqual(67.89);
  });

  it('should create multiple speed tests with different values', async () => {
    const input1: CreateSpeedTestInput = {
      download_speed: 50.0,
      upload_speed: 25.5
    };

    const input2: CreateSpeedTestInput = {
      download_speed: 75.25,
      upload_speed: 30.75
    };

    const result1 = await createSpeedTest(input1);
    const result2 = await createSpeedTest(input2);

    expect(result1.id).not.toEqual(result2.id);
    expect(result1.download_speed).toEqual(50.0);
    expect(result2.download_speed).toEqual(75.25);
    expect(result1.upload_speed).toEqual(25.5);
    expect(result2.upload_speed).toEqual(30.75);

    // Verify both are saved in database
    const allSpeedTests = await db.select()
      .from(speedTestsTable)
      .execute();

    expect(allSpeedTests).toHaveLength(2);
  });
});
