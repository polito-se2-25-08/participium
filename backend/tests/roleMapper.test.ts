import { normalizeRole, isValidRole, VALID_DB_ROLES } from '../src/utils/roleMapper';

let failures: string[] = [];

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (err) {
    console.error(`❌ ${name}`);
    failures.push(`${name}: ${(err as Error).message}`);
  }
}
const assert = {
  strictEqual(actual: any, expected: any, message?: string) {
    if (actual !== expected) {
      throw new Error(message ?? `Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`);
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
  }
};

// Test normalizeRole with valid roles (various casings)
for (const role of VALID_DB_ROLES) {
  test(`normalizeRole returns uppercase for ${role} (lowercase input)`, () => {
    const result = normalizeRole(role.toLowerCase());
    assert.strictEqual(result, role);
  });

  test(`normalizeRole returns same for already uppercase ${role}`, () => {
    const result = normalizeRole(role);
    assert.strictEqual(result, role);
  });

  test(`normalizeRole trims whitespace for role ${role}`, () => {
    const result = normalizeRole(`  ${role}  `);
    assert.strictEqual(result, role);
  });
}

// Test normalizeRole throws on invalid role
const invalidRoles = ['citizenn', 'admin1', 'unknown', '', '   ', 'user'];
for (const bad of invalidRoles) {
  test(`normalizeRole throws for invalid role '${bad}'`, () => {
    assert.throws(() => normalizeRole(bad));
  });
}

// Test isValidRole
for (const role of VALID_DB_ROLES) {
  test(`isValidRole true for ${role}`, () => {
    assert.strictEqual(isValidRole(role), true);
    assert.strictEqual(isValidRole(role.toLowerCase()), true);
  });
}
for (const bad of invalidRoles) {
  test(`isValidRole false for invalid '${bad}'`, () => {
    assert.strictEqual(isValidRole(bad), false);
  });
}

if (failures.length) {
  console.error('\nTest Failures:');
  for (const f of failures) console.error(' - ' + f);
  throw new Error('Test failures: ' + failures.join('; '));
} else {
  console.log('\nAll roleMapper tests passed.');
}
