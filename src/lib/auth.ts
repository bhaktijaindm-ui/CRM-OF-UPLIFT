import { cookies } from 'next/headers';
import { getDb } from './db';
import { User, UserRole } from './types';

export async function getSessionUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get('crm_session')?.value;

  if (!userId) {
    return null;
  }

  const db = getDb();
  const user = db.users.find(u => u.id === userId);

  return user || null;
}

export async function requireAuth(): Promise<User> {
  const user = await getSessionUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export function hasPermission(user: User, requiredRoles: UserRole[]): boolean {
  return requiredRoles.includes(user.role);
}
