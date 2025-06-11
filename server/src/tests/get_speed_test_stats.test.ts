
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { speedTestsTable } from '../db/schema';
import { getSpeedTestStats } from '../handlers/get_speed_test_stats';

describe('getSpeedTestStats', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return zero stats when no tests exist', async () => {
    const stats = await getSpeedTestStats();

    expect(stats.total_tests).toEqual(0);
    expect(stats.avg_download_speed).toEqual(0);
    expect(stats.avg_upload_speed).toEqual(0);
    expect(stats.max_download_speed).toEqual(0);
    expect(stats.max_upload_speed).toEqual(0);
    expect(stats.min_download_speed).toEqual(0);
    expect(stats.min_upload_speed).toEqual(0);
  });

  it('should calculate stats for single test', async () => {
    // Create a single test record
    await db.insert(speedTestsTable)
      .values({
        download_speed: '25.50',
        upload_speed: '10.25'
      })
      .execute();

    const stats = await getSpeedTestStats();

    expect(stats.total_tests).toEqual(1);
    expect(stats.avg_download_speed).toEqual(25.5);
    expect(stats.avg_upload_speed).toEqual(10.25);
    expect(stats.max_download_speed).toEqual(25.5);
    expect(stats.max_upload_speed).toEqual(10.25);
    expect(stats.min_download_speed).toEqual(25.5);
    expect(stats.min_upload_speed).toEqual(10.25);
  });

  it('should calculate stats for multiple tests', async () => {
    // Create multiple test records
    await db.insert(speedTestsTable)
      .values([
        { download_speed: '20.00', upload_speed: '5.00' },
        { download_speed: '30.00', upload_speed: '15.00' },
        { download_speed: '25.00', upload_speed: '10.00' }
      ])
      .execute();

    const stats = await getSpeedTestStats();

    expect(stats.total_tests).toEqual(3);
    expect(stats.avg_download_speed).toEqual(25.0); // (20 + 30 + 25) / 3
    expect(stats.avg_upload_speed).toEqual(10.0); // (5 + 15 + 10) / 3
    expect(stats.max_download_speed).toEqual(30.0);
    expect(stats.max_upload_speed).toEqual(15.0);
    expect(stats.min_download_speed).toEqual(20.0);
    expect(stats.min_upload_speed).toEqual(5.0);
  });

  it('should handle decimal precision correctly', async () => {
    // Create test with precise decimal values
    await db.insert(speedTestsTable)
      .values([
        { download_speed: '100.99', upload_speed: '50.33' },
        { download_speed: '200.01', upload_speed: '75.67' }
      ])
      .execute();

    const stats = await getSpeedTestStats();

    expect(stats.total_tests).toEqual(2);
    expect(stats.avg_download_speed).toEqual(150.5); // (100.99 + 200.01) / 2
    expect(stats.avg_upload_speed).toEqual(63.0); // (50.33 + 75.67) / 2
    expect(stats.max_download_speed).toEqual(200.01);
    expect(stats.max_upload_speed).toEqual(75.67);
    expect(stats.min_download_speed).toEqual(100.99);
    expect(stats.min_upload_speed).toEqual(50.33);
  });
});
