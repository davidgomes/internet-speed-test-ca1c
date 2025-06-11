
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { speedTestsTable } from '../db/schema';
import { getLatestSpeedTest } from '../handlers/get_latest_speed_test';

describe('getLatestSpeedTest', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return null when no speed tests exist', async () => {
    const result = await getLatestSpeedTest();
    expect(result).toBeNull();
  });

  it('should return the latest speed test', async () => {
    // Create test speed tests with different timestamps
    const firstTest = await db.insert(speedTestsTable)
      .values({
        download_speed: '25.50',
        upload_speed: '10.25'
      })
      .returning()
      .execute();

    // Wait a moment to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    const secondTest = await db.insert(speedTestsTable)
      .values({
        download_speed: '50.75',
        upload_speed: '20.50'
      })
      .returning()
      .execute();

    const result = await getLatestSpeedTest();

    expect(result).not.toBeNull();
    expect(result!.id).toEqual(secondTest[0].id);
    expect(result!.download_speed).toEqual(50.75);
    expect(result!.upload_speed).toEqual(20.50);
    expect(typeof result!.download_speed).toBe('number');
    expect(typeof result!.upload_speed).toBe('number');
    expect(result!.created_at).toBeInstanceOf(Date);
  });

  it('should return the most recent speed test among multiple', async () => {
    // Create multiple speed tests with deliberate delays to ensure different timestamps
    await db.insert(speedTestsTable)
      .values({
        download_speed: '10.00',
        upload_speed: '5.00'
      })
      .execute();

    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(speedTestsTable)
      .values({
        download_speed: '20.00',
        upload_speed: '10.00'
      })
      .execute();

    await new Promise(resolve => setTimeout(resolve, 10));

    const lastTest = await db.insert(speedTestsTable)
      .values({
        download_speed: '30.00',
        upload_speed: '15.00'
      })
      .returning()
      .execute();

    const result = await getLatestSpeedTest();

    expect(result).not.toBeNull();
    expect(result!.id).toEqual(lastTest[0].id);
    expect(result!.download_speed).toEqual(30.00);
    expect(result!.upload_speed).toEqual(15.00);
    expect(result!.created_at).toBeInstanceOf(Date);
  });

  it('should properly convert numeric fields to numbers', async () => {
    await db.insert(speedTestsTable)
      .values({
        download_speed: '99.99',
        upload_speed: '88.88'
      })
      .execute();

    const result = await getLatestSpeedTest();

    expect(result).not.toBeNull();
    expect(typeof result!.download_speed).toBe('number');
    expect(typeof result!.upload_speed).toBe('number');
    expect(result!.download_speed).toEqual(99.99);
    expect(result!.upload_speed).toEqual(88.88);
  });
});
