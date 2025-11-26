import * as ReportService from '../src/services/ReportService';

let failures: string[] = [];

function test(name: string, fn: () => void | Promise<void>) {
  return (async () => {
    try {
      await fn();
      console.log(`✅ ${name}`);
    } catch (err) {
      console.error(`❌ ${name}`);
      failures.push(`${name}: ${(err as Error).message}`);
    }
  })();
}

const assert = {
  strictEqual(actual: any, expected: any, message?: string) {
    if (actual !== expected) {
      throw new Error(message ?? `Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
    }
  },
  notEqual(actual: any, expected: any, message?: string) {
    if (actual === expected) {
      throw new Error(message ?? `Expected ${JSON.stringify(actual)} to not equal ${JSON.stringify(expected)}`);
    }
  },
  truthy(value: any, message?: string) {
    if (!value) {
      throw new Error(message ?? `Expected ${JSON.stringify(value)} to be truthy`);
    }
  },
  throws(fn: () => void) {
    let threw = false;
    try {
      fn();
    } catch {
      threw = true;
    }
    if (!threw) {
      throw new Error('Expected function to throw');
    }
  },
  async rejects(promise: Promise<any>) {
    let threw = false;
    try {
      await promise;
    } catch {
      threw = true;
    }
    if (!threw) {
      throw new Error('Expected promise to reject');
    }
  }
};

// Example tests
(async () => {
  // Test: getAllReports returns an array
  await test('getAllReports returns an array', async () => {
    const reports = await ReportService.getAllReports();
    assert.truthy(Array.isArray(reports), 'getAllReports should return an array');
  });

  // Test: getActiveReports returns an array
  await test('getActiveReports returns an array', async () => {
    const reports = await ReportService.getActiveReports();
    assert.truthy(Array.isArray(reports), 'getActiveReports should return an array');
  });

  // Test: getReportById with invalid ID should throw
  await test('getReportById throws for invalid ID', async () => {
    await assert.rejects(ReportService.getReportById(999999));
  });

  // Summary
  if (failures.length) {
    console.error('\n❌ Test Failures:');
    for (const f of failures) console.error(' - ' + f);
    throw new Error(`${failures.length} test(s) failed`);
  } else {
    console.log('\n✅ All ReportService tests passed.');
  }
})();
