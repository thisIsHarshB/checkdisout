import { User, Achievement, Participation, Project } from '@/lib/types';

export async function exportUserData(userId: string) {
  // Fetch user data from Firestore (pseudo-code, replace with real fetches)
  const user: User = await fetchUser(userId);
  const achievements: Achievement[] = await fetchAchievements(userId);
  const participations: Participation[] = await fetchParticipations(userId);
  const projects: Project[] = await fetchProjects(userId);

  const data = {
    user,
    achievements,
    participations,
    projects,
  };
  return data;
}

export function downloadJSON(data: any, filename = 'export.json') {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
// Note: fetchUser, fetchAchievements, fetchParticipations, fetchProjects should be implemented using Firestore queries or hooks. 