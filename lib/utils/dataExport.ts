import { User, Achievement, Participation, Project } from '@/lib/types';
import { userHelpers, achievementHelpers, participationHelpers, projectHelpers } from '@/lib/firebase/firestore';

export async function exportUserData(userId: string) {
  try {
    // Fetch user data from Firestore
    const userResult = await userHelpers.getById(userId);
    const achievementsResult = await achievementHelpers.getByUserId(userId);
    const participationsResult = await participationHelpers.getByUserId(userId);
    const projectsResult = await projectHelpers.getByUserId(userId);

    if (!userResult.success || !achievementsResult.success || !participationsResult.success || !projectsResult.success) {
      throw new Error('Failed to fetch user data');
    }

    const data = {
      user: userResult.data,
      achievements: achievementsResult.data || [],
      participations: participationsResult.data || [],
      projects: projectsResult.data || [],
    };
    return data;
  } catch (error) {
    console.error('Error exporting user data:', error);
    throw error;
  }
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