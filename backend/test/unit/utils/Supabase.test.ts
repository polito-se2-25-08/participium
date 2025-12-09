describe('Supabase', () => {
  it('should create supabase client when environment variables are set', () => {
    // This test verifies the module loads successfully with env vars
    const { supabase } = require('../../../src/utils/Supabase');

    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
  });
});
