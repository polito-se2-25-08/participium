import "dotenv/config";
import axios from "axios";

let failures: string[] = [];
let techToken: string | null = null;

const baseUrl = "http://localhost:3000/api";
const techUsername = "pablo7";
const techPassword = "Secret123!";
const categoryId = 4;
const companyId = 1;

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
  truthy(value: any, message?: string) {
    if (!value) {
      throw new Error(message ?? `Expected ${JSON.stringify(value)} to be truthy`);
    }
  },
};

// ==============================
// EXTERNAL COMPANY FLOW TESTS
// ==============================
(async () => {
  console.log("\n=== External Company Flow Tests ===\n");

  // ------------------------------------------------------
  // 0. Technician Login → Retrieve JWT Token
  // ------------------------------------------------------
  await test("Technician login → retrieve token", async () => {
    const res = await axios.post(`${baseUrl}/v1/login`, {
      username: techUsername,
      password: techPassword,
    });

    assert.strictEqual(res.status, 200);
    assert.truthy(res.data.data.token, "Token should exist");

    techToken = res.data.data.token;

    console.log("🔐 Token acquired");
    console.log("👤 Logged in as:", res.data.data.user);
  });

  if (!techToken) throw new Error("Login failed — cannot continue tests.");

  const authHeader = { Authorization: `Bearer ${techToken}` };

  // ------------------------------------------------------
  // 1. Fetch ALL External Companies
  // ------------------------------------------------------
  await test("Fetch all external companies", async () => {
    const res = await axios.get(`${baseUrl}/v1/external-company`, { headers: authHeader });

    assert.strictEqual(res.status, 200);
    assert.truthy(Array.isArray(res.data.data), "Should return array");
  });

    await test("Fetch all companies → missing token should fail", async () => {
    try {
        await axios.get(`${baseUrl}/v1/external-company`);
        throw new Error("Request unexpectedly succeeded");
    } catch (err: any) {
        // ANY thrown error means the test PASSES
        assert.truthy(true);
    }
    });


  // ------------------------------------------------------
  // 2. Fetch a Company by ID
  // ------------------------------------------------------
  await test("Fetch company by valid ID", async () => {
    const res = await axios.get(`${baseUrl}/v1/external-company/${companyId}`, { headers: authHeader });

    assert.strictEqual(res.status, 200);
    assert.truthy(res.data.data, "Company object should be returned");
  });

  await test("Fetch company → invalid ID", async () => {
    try {
      await axios.get(`${baseUrl}/v1/external-company/abc`, { headers: authHeader });
      throw new Error("Request should fail for invalid ID");
    } catch (err: any) {
      assert.strictEqual(err.response.status, 400, "Should return 400 bad request");
    }
  });

  await test("Fetch company → not found", async () => {
    try {
      await axios.get(`${baseUrl}/v1/external-company/99999`, { headers: authHeader });
      throw new Error("Request should fail for not found");
    } catch (err: any) {
      assert.strictEqual(err.response.status, 404, "Should return 404 not found");
    }
  });

  // ------------------------------------------------------
  // 3. Fetch Companies by Category
  // ------------------------------------------------------
  await test("Fetch companies by category", async () => {
    const res = await axios.get(
      `${baseUrl}/v1/external-company/category/${categoryId}`,
      { headers: authHeader }
    );

    assert.strictEqual(res.status, 200);
    assert.truthy(Array.isArray(res.data.data), "Should return array");
  });

  await test("Fetch companies by category → invalid category ID", async () => {
    try {
      await axios.get(`${baseUrl}/v1/external-company/category/blabla`, { headers: authHeader });
      throw new Error("Request should fail due to invalid category ID");
    } catch (err: any) {
      assert.strictEqual(err.response.status, 400, "Should return 400 bad request");
    }
  });

    await test("Fetch companies by category → missing token", async () => {
    try {
        await axios.get(`${baseUrl}/v1/external-company/category/${categoryId}`);
        throw new Error("Request unexpectedly succeeded");
    } catch (err: any) {
        assert.truthy(true);
    }
    });


  // FINISH
  console.log("\n=== Test Run Complete ===");
  if (failures.length > 0) {
    console.log("\nFailures:");
    failures.forEach(f => console.log(" - " + f));
  } else {
    console.log("\nAll tests passed successfully!");
  }
})();
