import type { User } from "../interfaces/dto/user/User";

export function getDefaultRouteForRole(role: User['role']): string {
  switch (role) {
    case 'OFFICER':
      return '/pending-reports';
    case 'ADMIN':
      return '/setup';
    case 'CITIZEN':
      return '/dashboard';
    default:
      return '/dashboard';
  }
}
