import { User, Achievement, Participation, Project } from '@/lib/types';

export function validateImportedData(data: any): boolean {
  // Basic validation: check required keys
  return (
    data &&
    typeof data === 'object' &&
    data.user &&
    Array.isArray(data.achievements) &&
    Array.isArray(data.participations) &&
    Array.isArray(data.projects)
  );
}

export async function migrateUserData(data: any) {
  // Example: migrate old field names or structures if needed
  // (No-op for now, add logic as needed for future migrations)
  return data;
} 