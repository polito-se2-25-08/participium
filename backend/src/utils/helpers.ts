export const sum = (a: number, b: number): number => {
  return a + b;
};

export const isValidEmail = (email: string): boolean => {
  // Use a more specific regex to avoid ReDoS (super-linear runtime)
  // [a-zA-Z0-9._%+-]+ matches the local part
  // @[a-zA-Z0-9.-]+ matches domain name
  // \.[a-zA-Z]{2,} matches TLD
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};
