import React from 'react';
import { Document, Page, Text, View, Link, StyleSheet } from '@react-pdf/renderer';

// Example props, to be expanded based on PRD and app data
interface PortfolioPDFProps {
  user: {
    name: string;
    email: string;
    profileImage?: string;
    bio?: string;
    // ...other fields
  };
  sections: {
    achievements?: boolean;
    projects?: boolean;
    participations?: boolean;
    // ...other sections
  };
  achievements?: Array<any>; // To be typed
  projects?: Array<any>; // To be typed
  participations?: Array<any>; // To be typed
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Helvetica',
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#222',
  },
  text: {
    fontSize: 12,
    color: '#333',
  },
  link: {
    color: '#007bff',
    textDecoration: 'underline',
  },
});

const PortfolioPDF: React.FC<PortfolioPDFProps> = ({ user, sections, achievements, projects, participations }) => {
  const safeAchievements = Array.isArray(achievements) ? achievements : [];
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeParticipations = Array.isArray(participations) ? participations : [];
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* User Profile Section */}
        <View style={styles.section}>
          <Text style={styles.heading}>{user?.name || ''}</Text>
          <Text style={styles.text}>{user?.email || ''}</Text>
          {user?.bio && <Text style={styles.text}>{user.bio}</Text>}
        </View>

        {/* Achievements Section */}
        {sections.achievements && safeAchievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.heading}>Achievements</Text>
            {safeAchievements.map((ach, idx) => (
              ach?.title ? <Text key={idx} style={styles.text}>{ach.title}</Text> : null
            ))}
          </View>
        )}

        {/* Projects Section */}
        {sections.projects && safeProjects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.heading}>Projects</Text>
            {safeProjects.map((proj, idx) => (
              proj?.title ? (
                <View key={idx}>
                  <Text style={styles.text}>{proj.title}</Text>
                  {proj.link && (
                    <Link src={proj.link} style={styles.link}>{proj.link}</Link>
                  )}
                </View>
              ) : null
            ))}
          </View>
        )}

        {/* Participations Section */}
        {sections.participations && safeParticipations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.heading}>Participations</Text>
            {safeParticipations.map((part, idx) => (
              part?.title ? <Text key={idx} style={styles.text}>{part.title}</Text> : null
            ))}
          </View>
        )}

        {/* Add more sections as needed */}
      </Page>
    </Document>
  );
};

export default PortfolioPDF; 