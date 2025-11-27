import { toSnakeCase } from '../../../src/utils/ToSnakeCase';

describe('toSnakeCase', () => {
  it('should convert camelCase to snake_case', () => {
    const input = {
      firstName: 'John',
      lastName: 'Doe',
      emailAddress: 'john@example.com',
    };
    
    const result = toSnakeCase(input);
    
    expect(result).toEqual({
      first_name: 'John',
      last_name: 'Doe',
      email_address: 'john@example.com',
    });
  });

  it('should handle already snake_case keys', () => {
    const input = {
      first_name: 'John',
      last_name: 'Doe',
    };
    
    const result = toSnakeCase(input);
    
    expect(result).toEqual(input);
  });

  it('should handle mixed case keys', () => {
    const input = {
      userId: 123,
      user_name: 'john',
      emailAddress: 'john@example.com',
    };
    
    const result = toSnakeCase(input);
    
    expect(result).toEqual({
      user_id: 123,
      user_name: 'john',
      email_address: 'john@example.com',
    });
  });

  it('should handle empty object', () => {
    const input = {};
    const result = toSnakeCase(input);
    
    expect(result).toEqual({});
  });

  it('should preserve values while converting keys', () => {
    const input = {
      userName: 'testUser',
      userAge: 25,
      isActive: true,
      userData: { nested: 'value' },
      userArray: [1, 2, 3],
    };
    
    const result = toSnakeCase(input);
    
    expect(result.user_name).toBe('testUser');
    expect(result.user_age).toBe(25);
    expect(result.is_active).toBe(true);
    expect(result.user_data).toEqual({ nested: 'value' });
    expect(result.user_array).toEqual([1, 2, 3]);
  });

  it('should handle single word keys', () => {
    const input = {
      name: 'John',
      age: 30,
    };
    
    const result = toSnakeCase(input);
    
    expect(result).toEqual({
      name: 'John',
      age: 30,
    });
  });

  it('should handle multiple uppercase letters', () => {
    const input = {
      HTMLContent: '<div>Test</div>',
      XMLData: '<root></root>',
    };
    
    const result = toSnakeCase(input);
    
    expect(result).toEqual({
      _h_t_m_l_content: '<div>Test</div>',
      _x_m_l_data: '<root></root>',
    });
  });

  it('should handle null and undefined values', () => {
    const input = {
      userName: null,
      userEmail: undefined,
      userId: 0,
    };
    
    const result = toSnakeCase(input);
    
    expect(result.user_name).toBeNull();
    expect(result.user_email).toBeUndefined();
    expect(result.user_id).toBe(0);
  });
});
