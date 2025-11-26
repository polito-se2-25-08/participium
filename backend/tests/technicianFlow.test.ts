import axios, { AxiosError } from 'axios';

const baseUrl = 'http://localhost:3000/api';

// Use existing credentials
const adminUsername = 'Haland';
const adminPassword = 'Secret123!';
let adminToken = '';

const techUsername = 'Clara';
const techPassword = 'Secret123!';
const techUserId = 46;
let techToken = '';

let failures: string[] = [];
let testReportId: number | null = null;

function test(name: string, fn: () => Promise<void>) {
  return async () => {
    try {
      await fn();
      console.log(`✅ ${name}`);
    } catch (err) {
      console.error(`❌ ${name}`);
      const error = err as AxiosError | Error;
      failures.push(`${name}: ${error.message}`);
    }
  };
}

const assert = {
  strictEqual(actual: any, expected: any, message?: string) {
    if (actual !== expected) {
      throw new Error(message ?? `Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
    }
  },
  ok(value: any, message?: string) {
    if (!value) {
      throw new Error(message ?? `Expected ${JSON.stringify(value)} to be truthy`);
    }
  },
  isArray(value: any, message?: string) {
    if (!Array.isArray(value)) {
      throw new Error(message ?? `Expected ${JSON.stringify(value)} to be an array`);
    }
  },
  async rejects(fn: () => Promise<any>, message?: string) {
    let threw = false;
    try {
      await fn();
    } catch {
      threw = true;
    }
    if (!threw) {
      throw new Error(message ?? 'Expected function to reject');
    }
  }
};

// Test Suite
const tests = [
  // 0. Admin Login
  test('Admin can login and get JWT token', async () => {
    const response = await axios.post(`${baseUrl}/v1/login`, {
      username: adminUsername,
      password: adminPassword
    });
    assert.strictEqual(response.status, 200);
    assert.ok(response.data.success, 'Response should indicate success');
    assert.ok(response.data.data.token, 'Token should be present');
    assert.ok(response.data.data.user, 'User data should be present');
    assert.strictEqual(response.data.data.user.role, 'ADMIN', 'User role should be ADMIN');
    adminToken = response.data.data.token; // Update token
    console.log(`   Admin token: ${adminToken.substring(0, 20)}...`);
  }),

  // 1. Technician Login
  test('Technician can login and get JWT token', async () => {
    const response = await axios.post(`${baseUrl}/v1/login`, {
      username: techUsername,
      password: techPassword
    });
    assert.strictEqual(response.status, 200);
    assert.ok(response.data.success, 'Response should indicate success');
    assert.ok(response.data.data.token, 'Token should be present');
    assert.ok(response.data.data.user, 'User data should be present');
    assert.strictEqual(response.data.data.user.role, 'TECHNICIAN', 'User role should be TECHNICIAN');
    techToken = response.data.data.token; // Update token
    console.log(`   Technician token: ${techToken.substring(0, 20)}...`);
  }),

  // 2. Admin assigns category to technician
  test('Admin can assign category to technician', async () => {
    const response = await axios.put(
      `${baseUrl}/v1/admin/technicians/${techUserId}/category`,
      { category_id: 2 },
      { headers: { Authorization: `Bearer ${adminToken}` } }
    );
    assert.ok(response.status === 200 || response.status === 204);
  }),

  // 3. Admin cannot assign invalid category
  test('Admin cannot assign invalid category (0)', async () => {
    await assert.rejects(
      async () => {
        await axios.put(
          `${baseUrl}/v1/admin/technicians/${techUserId}/category`,
          { category_id: 0 },
          { headers: { Authorization: `Bearer ${adminToken}` } }
        );
      },
      'Should reject invalid category'
    );
  }),

  // 4. Technician fetch reports (default status = ASSIGNED)
  test('Technician can fetch reports for their category', async () => {
    const response = await axios.get(`${baseUrl}/v1/technician/reports`, {
      headers: { Authorization: `Bearer ${techToken}` }
    });
    assert.strictEqual(response.status, 200);
    
    // Handle both array response and wrapped response
    const reports = response.data.data || response.data;
    assert.isArray(reports, 'Response should be an array');
    console.log(`   Found ${reports.length} reports`);
    
    if (reports.length > 0) {
      testReportId = reports[0].id;
      console.log(`   Using report ID ${testReportId} for subsequent tests`);
    }
  }),

  // 5. Technician fetch reports with status filter (IN_PROGRESS)
  test('Technician can fetch IN_PROGRESS reports', async () => {
    const response = await axios.get(`${baseUrl}/v1/technician/reports?status=IN_PROGRESS`, {
      headers: { Authorization: `Bearer ${techToken}` }
    });
    assert.strictEqual(response.status, 200);
    const reports = response.data.data || response.data;
    assert.isArray(reports);
    console.log(`   Found ${reports.length} IN_PROGRESS reports`);
  }),

  // 6. Technician fetch reports with status filter (SUSPENDED)
  test('Technician can fetch SUSPENDED reports', async () => {
    const response = await axios.get(`${baseUrl}/v1/technician/reports?status=SUSPENDED`, {
      headers: { Authorization: `Bearer ${techToken}` }
    });
    assert.strictEqual(response.status, 200);
    const reports = response.data.data || response.data;
    assert.isArray(reports);
    console.log(`   Found ${reports.length} SUSPENDED reports`);
  }),

  // 7. Technician fetch reports with status filter (RESOLVED)
  test('Technician can fetch RESOLVED reports', async () => {
    const response = await axios.get(`${baseUrl}/v1/technician/reports?status=RESOLVED`, {
      headers: { Authorization: `Bearer ${techToken}` }
    });
    assert.strictEqual(response.status, 200);
    const reports = response.data.data || response.data;
    assert.isArray(reports);
    console.log(`   Found ${reports.length} RESOLVED reports`);
  }),

  // 8. Technician fetch reports with status filter (REJECTED)
  test('Technician can fetch REJECTED reports', async () => {
    const response = await axios.get(`${baseUrl}/v1/technician/reports?status=REJECTED`, {
      headers: { Authorization: `Bearer ${techToken}` }
    });
    assert.strictEqual(response.status, 200);
    const reports = response.data.data || response.data;
    assert.isArray(reports);
    console.log(`   Found ${reports.length} REJECTED reports`);
  }),

  // 9. Cannot fetch reports without token
  test('Cannot fetch reports without authentication token', async () => {
    await assert.rejects(
      async () => {
        await axios.get(`${baseUrl}/v1/technician/reports`);
      },
      'Should reject request without token'
    );
  }),

  // 10. Update report status to IN_PROGRESS
  test('Technician can update report status to IN_PROGRESS', async () => {
    if (!testReportId) {
      console.log('   ⚠️  Skipping: No test report available');
      return;
    }
    const response = await axios.patch(
      `${baseUrl}/v1/reports/${testReportId}/status`,
      { status: 'IN_PROGRESS' },
      { headers: { Authorization: `Bearer ${techToken}` } }
    );
    assert.ok(response.status === 200 || response.status === 204);
  }),

  // 11. Update report status to SUSPENDED
  test('Technician can update report status to SUSPENDED', async () => {
    if (!testReportId) {
      console.log('   ⚠️  Skipping: No test report available');
      return;
    }
    const response = await axios.patch(
      `${baseUrl}/v1/reports/${testReportId}/status`,
      { status: 'SUSPENDED' },
      { headers: { Authorization: `Bearer ${techToken}` } }
    );
    assert.ok(response.status === 200 || response.status === 204);
  }),

  // 12. Update report status to RESOLVED
  test('Technician can update report status to RESOLVED', async () => {
    if (!testReportId) {
      console.log('   ⚠️  Skipping: No test report available');
      return;
    }
    const response = await axios.patch(
      `${baseUrl}/v1/reports/${testReportId}/status`,
      { status: 'RESOLVED' },
      { headers: { Authorization: `Bearer ${techToken}` } }
    );
    assert.ok(response.status === 200 || response.status === 204);
  }),

  // 13. Send a message on a report
  test('Technician can send a message on a report', async () => {
    if (!testReportId) {
      console.log('   ⚠️  Skipping: No test report available');
      return;
    }
    const response = await axios.post(
      `${baseUrl}/v1/reports/${testReportId}/messages`,
      { message: 'Test message from technician' },
      { headers: { Authorization: `Bearer ${techToken}` } }
    );
    assert.strictEqual(response.status, 201);
  }),

  // 14. Get messages for a report
  test('Technician can get messages for a report', async () => {
    if (!testReportId) {
      console.log('   ⚠️  Skipping: No test report available');
      return;
    }
    const response = await axios.get(
      `${baseUrl}/v1/reports/${testReportId}/messages`,
      { headers: { Authorization: `Bearer ${techToken}` } }
    );
    assert.strictEqual(response.status, 200);
    const messages = response.data.data || response.data;
    assert.isArray(messages);
    console.log(`   Found ${messages.length} messages`);
  }),

  // 15. Get unread notifications
  test('Technician can get unread notifications', async () => {
    const response = await axios.get(`${baseUrl}/v1/notifications`, {
      headers: { Authorization: `Bearer ${techToken}` }
    });
    assert.strictEqual(response.status, 200);
    const notifications = response.data.data || response.data;
    assert.isArray(notifications);
    console.log(`   Found ${notifications.length} notifications`);
  }),

  // 16. Mark notification as read
  test('Technician can mark notification as read', async () => {
    // First get notifications to find one to mark as read
    const notificationsResponse = await axios.get(`${baseUrl}/v1/notifications`, {
      headers: { Authorization: `Bearer ${techToken}` }
    });
    
    const notifications = notificationsResponse.data.data || notificationsResponse.data;
    
    if (notifications.length > 0) {
      const notificationId = notifications[0].id;
      const response = await axios.patch(
        `${baseUrl}/v1/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${techToken}` } }
      );
      assert.ok(response.status === 200 || response.status === 204);
      console.log(`   Marked notification ${notificationId} as read`);
    } else {
      console.log('   ⚠️  Skipping: No notifications available');
    }
  }),

  // 17. Cannot update report status with invalid status
  test('Cannot update report status with invalid status', async () => {
    if (!testReportId) {
      console.log('   ⚠️  Skipping: No test report available');
      return;
    }
    await assert.rejects(
      async () => {
        await axios.patch(
          `${baseUrl}/v1/reports/${testReportId}/status`,
          { status: 'INVALID_STATUS' },
          { headers: { Authorization: `Bearer ${techToken}` } }
        );
      },
      'Should reject invalid status'
    );
  }),

  // 18. Cannot send empty message
  test('Cannot send empty message on a report', async () => {
    if (!testReportId) {
      console.log('   ⚠️  Skipping: No test report available');
      return;
    }
    await assert.rejects(
      async () => {
        await axios.post(
          `${baseUrl}/v1/reports/${testReportId}/messages`,
          { message: '' },
          { headers: { Authorization: `Bearer ${techToken}` } }
        );
      },
      'Should reject empty message'
    );
  })
];

// Run all tests
async function runTests() {
  console.log('🧪 Running Technician Flow Tests...\n');
  
  for (const testFn of tests) {
    await testFn();
  }

  console.log('\n' + '='.repeat(50));
  if (failures.length) {
    console.error(`\n❌ ${failures.length} Test Failure(s):\n`);
    for (const f of failures) console.error(' - ' + f);
    process.exit(1);
  } else {
    console.log('\n✅ All technician flow tests passed.');
    console.log(`\n📊 Total tests: ${tests.length}`);
  }
}

runTests().catch(err => {
  console.error('\n💥 Test suite failed:', err.message);
  process.exit(1);
});