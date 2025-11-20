export type DbRole = "CITIZEN" | "ADMIN" | "OFFICER" | "TECHNICIAN";

export const VALID_DB_ROLES: DbRole[] = ["CITIZEN", "ADMIN", "OFFICER", "TECHNICIAN"];

/**
 * Validates and normalizes a role string to a DB role.
 * @param role - Role string to validate
 * @returns The corresponding DB role (uppercase)
 * @throws Error if the role is invalid
 */
export const normalizeRole = (role: string): DbRole => {
  const upperRole = role.toUpperCase().trim() as DbRole;
  
  if (VALID_DB_ROLES.includes(upperRole)) {
    return upperRole;
  }

  throw new Error(`Invalid role: ${role}`);
};

/**
 * Validates if a given string is a valid role
 * @param role - Role string to validate
 * @returns true if valid, false otherwise
 */
export const isValidRole = (role: string): boolean => {
  try {
    normalizeRole(role);
    return true;
  } catch {
    return false;
  }
};
