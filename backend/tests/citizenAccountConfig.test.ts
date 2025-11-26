import "dotenv/config";
import * as UserService from '../src/services/userService';
import * as UserRepository from '../src/repositories/userRepository';

let failures: string[] = [];
let testUserId: number | null = null;
const testUsername = `test_citizen_${Date.now()}`;

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
  falsy(value: any, message?: string) {
    if (value) {
      throw new Error(message ?? `Expected ${JSON.stringify(value)} to be falsy`);
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

// Citizen Account Configuration Tests
(async () => {
  console.log('Starting Citizen Account Configuration Tests\n');

  // Setup: Create a test citizen user
  await test('Setup: Create test citizen user', async () => {
    const user = await UserService.userService.registerUser({
      email: `${testUsername}@test.com`,
      username: testUsername,
      password: 'TestPassword123!',
      name: 'Test',
      surname: 'Citizen',
      telegram_username: null,
    });
    
    testUserId = user.id;
    assert.truthy(testUserId, 'User ID should be set');
    assert.strictEqual(user.role, 'CITIZEN', 'User should have CITIZEN role');
    assert.strictEqual(user.email_notification, null, 'Email notification should be null by default');
    assert.strictEqual(user.profile_picture, null, 'Profile picture should be null by default');
    assert.strictEqual(user.telegram_username, null, 'Telegram username should be null by default');
  });

  // Test 1: Upload personal photo
  await test('Upload personal photo (profile picture)', async () => {
    if (!testUserId) throw new Error('Test user must exist');
    
    const photoBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=';
    
    const updatedUser = await UserService.userService.updateUser(testUserId, {
      profilePicture: photoBase64,
    });
    
    assert.strictEqual(updatedUser.profile_picture, photoBase64, 'Profile picture should be updated');
  });

  // Test 2: Retrieve user with uploaded photo
  await test('Retrieve user profile with uploaded photo', async () => {
    if (!testUserId) throw new Error('Test user must exist');
    
    const user = await UserService.userService.getUserById(testUserId);
    
    assert.truthy(user.profile_picture, 'Profile picture should exist');
    assert.truthy(user.profile_picture?.startsWith('data:image/'), 'Profile picture should be a valid data URI');
  });

  // Test 3: Update profile picture to a different image
  await test('Update existing profile picture', async () => {
    if (!testUserId) throw new Error('Test user must exist');
    
    const newPhotoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    
    const updatedUser = await UserService.userService.updateUser(testUserId, {
      profilePicture: newPhotoBase64,
    });
    
    assert.strictEqual(updatedUser.profile_picture, newPhotoBase64, 'Profile picture should be updated to new image');
  });

  // Test 4: Remove profile picture
  await test('Remove profile picture', async () => {
    if (!testUserId) throw new Error('Test user must exist');
    
    const updatedUser = await UserService.userService.updateUser(testUserId, {
      profilePicture: null,
    });
    
    assert.strictEqual(updatedUser.profile_picture, null, 'Profile picture should be removed');
  });

  // Test 5: Add Telegram username
  await test('Add Telegram username', async () => {
    if (!testUserId) throw new Error('Test user must exist');
    
    const telegramUsername = '@testcitizen';
    
    const updatedUser = await UserService.userService.updateUser(testUserId, {
      telegramUsername: telegramUsername,
    });
    
    assert.strictEqual(updatedUser.telegram_username, telegramUsername, 'Telegram username should be set');
  });

  // Test 6: Update existing Telegram username
  await test('Update existing Telegram username', async () => {
    if (!testUserId) throw new Error('Test user must exist');
    
    const newTelegramUsername = '@newusername';
    
    const updatedUser = await UserService.userService.updateUser(testUserId, {
      telegramUsername: newTelegramUsername,
    });
    
    assert.strictEqual(updatedUser.telegram_username, newTelegramUsername, 'Telegram username should be updated');
  });

  // Test 7: Remove Telegram username
  await test('Remove Telegram username', async () => {
    if (!testUserId) throw new Error('Test user must exist');
    
    const updatedUser = await UserService.userService.updateUser(testUserId, {
      telegramUsername: null,
    });
    
    assert.strictEqual(updatedUser.telegram_username, null, 'Telegram username should be removed');
  });

  // Test 8: Enable email notifications
  await test('Enable email notifications', async () => {
    if (!testUserId) throw new Error('Test user must exist');
    
    const updatedUser = await UserService.userService.updateUser(testUserId, {
      emailNotification: true,
    });
    
    assert.strictEqual(updatedUser.email_notification, true, 'Email notifications should be enabled');
  });

  // Test 9: Disable email notifications
  await test('Disable email notifications', async () => {
    if (!testUserId) throw new Error('Test user must exist');
    
    const updatedUser = await UserService.userService.updateUser(testUserId, {
      emailNotification: false,
    });
    
    assert.strictEqual(updatedUser.email_notification, false, 'Email notifications should be disabled');
  });

  // Test 10: Toggle email notifications (off -> on -> off)
  await test('Toggle email notifications multiple times', async () => {
    if (!testUserId) throw new Error('Test user must exist');
    
    // Enable
    let updatedUser = await UserService.userService.updateUser(testUserId, {
      emailNotification: true,
    });
    assert.strictEqual(updatedUser.email_notification, true, 'Should be enabled');
    
    // Disable
    updatedUser = await UserService.userService.updateUser(testUserId, {
      emailNotification: false,
    });
    assert.strictEqual(updatedUser.email_notification, false, 'Should be disabled');
    
    // Enable again
    updatedUser = await UserService.userService.updateUser(testUserId, {
      emailNotification: true,
    });
    assert.strictEqual(updatedUser.email_notification, true, 'Should be enabled again');
  });

  // Test 11: Update all configuration fields at once
  await test('Update all configuration fields simultaneously', async () => {
    if (!testUserId) throw new Error('Test user must exist');
    
    const photoBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=';
    const telegramUsername = '@fullconfig';
    
    const updatedUser = await UserService.userService.updateUser(testUserId, {
      profilePicture: photoBase64,
      telegramUsername: telegramUsername,
      emailNotification: true,
    });
    
    assert.strictEqual(updatedUser.profile_picture, photoBase64, 'Profile picture should be set');
    assert.strictEqual(updatedUser.telegram_username, telegramUsername, 'Telegram username should be set');
    assert.strictEqual(updatedUser.email_notification, true, 'Email notifications should be enabled');
  });

  // Test 12: Verify user configuration persists
  await test('Verify configuration persists after retrieval', async () => {
    if (!testUserId) throw new Error('Test user must exist');
    
    const user = await UserService.userService.getUserById(testUserId);
    
    assert.truthy(user.profile_picture, 'Profile picture should persist');
    assert.strictEqual(user.telegram_username, '@fullconfig', 'Telegram username should persist');
    assert.strictEqual(user.email_notification, true, 'Email notification setting should persist');
  });

  // Test 13: Update with partial configuration
  await test('Update partial configuration fields', async () => {
    if (!testUserId) throw new Error('Test user must exist');
    
    // Only update telegram username, leave others unchanged
    const updatedUser = await UserService.userService.updateUser(testUserId, {
      telegramUsername: '@partialupdate',
    });
    
    assert.strictEqual(updatedUser.telegram_username, '@partialupdate', 'Telegram username should be updated');
    assert.truthy(updatedUser.profile_picture, 'Profile picture should remain unchanged');
    assert.strictEqual(updatedUser.email_notification, true, 'Email notification should remain unchanged');
  });

  // Test 14: Validate Telegram username format (various formats)
  await test('Accept various Telegram username formats', async () => {
    if (!testUserId) throw new Error('Test user must exist');
    
    const formats = ['@username', 'username', '@user_name', '@user123'];
    
    for (const format of formats) {
      const updatedUser = await UserService.userService.updateUser(testUserId, {
        telegramUsername: format,
      });
      assert.strictEqual(updatedUser.telegram_username, format, `Should accept format: ${format}`);
    }
  });

  // Test 15: Test updating with empty string vs null
  await test('Handle empty string vs null for optional fields', async () => {
    if (!testUserId) throw new Error('Test user must exist');
    
    // Set to null
    let updatedUser = await UserService.userService.updateUser(testUserId, {
      telegramUsername: null,
    });
    assert.strictEqual(updatedUser.telegram_username, null, 'Should accept null');
    
    // Set to empty string (should be stored as-is or converted to null based on schema)
    updatedUser = await UserService.userService.updateUser(testUserId, {
      telegramUsername: '',
    });
    assert.truthy(updatedUser.telegram_username === '' || updatedUser.telegram_username === null, 'Should handle empty string');
  });

  // Test 16: Update configuration for non-existent user
  await test('Fail to update configuration for non-existent user', async () => {
    await assert.rejects(
      UserService.userService.updateUser(999999, {
        emailNotification: true,
      })
    );
  });

  // Test 17: Retrieve configuration through getUserById
  await test('Retrieve user configuration through getUserById', async () => {
    if (!testUserId) throw new Error('Test user must exist');
    
    const user = await UserService.userService.getUserById(testUserId);
    
    assert.truthy(user, 'User should exist');
    assert.truthy('email_notification' in user, 'Should have email_notification field');
    assert.truthy('profile_picture' in user, 'Should have profile_picture field');
    assert.truthy('telegram_username' in user, 'Should have telegram_username field');
  });

  // Test 18: Verify default values for new users
  await test('Verify default configuration values for new citizen', async () => {
    const newUser = await UserService.userService.registerUser({
      email: `newcitizen_${Date.now()}@test.com`,
      username: `newcitizen_${Date.now()}`,
      password: 'Password123!',
      name: 'New',
      surname: 'Citizen',
    });
    
    assert.strictEqual(newUser.email_notification, null, 'Email notification should default to null');
    assert.strictEqual(newUser.profile_picture, null, 'Profile picture should default to null');
    assert.strictEqual(newUser.telegram_username, null, 'Telegram username should default to null');
  });

  // Test 19: Register user with telegram username
  await test('Register new user with telegram username', async () => {
    const userWithTelegram = await UserService.userService.registerUser({
      email: `telegram_user_${Date.now()}@test.com`,
      username: `telegram_user_${Date.now()}`,
      password: 'Password123!',
      name: 'Telegram',
      surname: 'User',
      telegram_username: '@initialtelegram',
    });
    
    assert.strictEqual(userWithTelegram.telegram_username, '@initialtelegram', 'Telegram username should be set during registration');
  });

  // Test 20: Reset all configuration to defaults
  await test('Reset all configuration fields to null/default', async () => {
    if (!testUserId) throw new Error('Test user must exist');
    
    const updatedUser = await UserService.userService.updateUser(testUserId, {
      profilePicture: null,
      telegramUsername: null,
      emailNotification: null,
    });
    
    assert.strictEqual(updatedUser.profile_picture, null, 'Profile picture should be null');
    assert.strictEqual(updatedUser.telegram_username, null, 'Telegram username should be null');
    assert.strictEqual(updatedUser.email_notification, null, 'Email notification should be null');
  });

  // Summary
  if (failures.length) {
    console.error('\n❌ Test Failures:');
    for (const f of failures) console.error(' - ' + f);
    throw new Error(`${failures.length} test(s) failed`);
  } else {
    console.log('\n✅ All Citizen Account Configuration tests passed.');
    console.log(`📊 Total tests run: ${20}`);
  }
})();
