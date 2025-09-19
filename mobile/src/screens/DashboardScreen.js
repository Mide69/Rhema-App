import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Button, Avatar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { theme, spacing } from '../theme/theme';

const DashboardScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.auth);

  const quickActions = [
    { title: 'My Courses', icon: 'book-open', screen: 'Courses' },
    { title: 'Payments', icon: 'credit-card', screen: 'Payments' },
    { title: 'Exams', icon: 'clipboard-text', screen: 'Exams' },
    { title: 'Live Stream', icon: 'video', screen: 'LiveStream' },
    { title: 'Materials', icon: 'file-document', screen: 'Materials' },
    { title: 'Notifications', icon: 'bell', screen: 'Notifications' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Card */}
      <Card style={styles.welcomeCard}>
        <Card.Content style={styles.welcomeContent}>
          <Avatar.Text 
            size={60} 
            label={`${user?.firstName?.[0]}${user?.lastName?.[0]}`}
            style={styles.avatar}
          />
          <View style={styles.welcomeText}>
            <Text variant="headlineSmall">
              Welcome, {user?.firstName}!
            </Text>
            <Text variant="bodyMedium" style={styles.studentId}>
              Student ID: {user?.studentId}
            </Text>
            <Text variant="bodySmall" style={styles.campus}>
              {user?.campus} Campus
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Quick Actions */}
      <Text variant="titleLarge" style={styles.sectionTitle}>
        Quick Actions
      </Text>
      
      <View style={styles.actionsGrid}>
        {quickActions.map((action, index) => (
          <Card 
            key={index} 
            style={styles.actionCard}
            onPress={() => navigation.navigate(action.screen)}
          >
            <Card.Content style={styles.actionContent}>
              <Avatar.Icon 
                size={40} 
                icon={action.icon} 
                style={styles.actionIcon}
              />
              <Text variant="bodyMedium" style={styles.actionTitle}>
                {action.title}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Recent Activity */}
      <Text variant="titleLarge" style={styles.sectionTitle}>
        Recent Activity
      </Text>
      
      <Card style={styles.activityCard}>
        <Card.Content>
          <Text variant="bodyMedium">
            • New assignment posted in Biblical Studies
          </Text>
          <Text variant="bodyMedium">
            • Payment reminder: Tuition fee due in 5 days
          </Text>
          <Text variant="bodyMedium">
            • Live stream: Sunday Service at 10:00 AM
          </Text>
        </Card.Content>
      </Card>

      {/* Announcements */}
      <Text variant="titleLarge" style={styles.sectionTitle}>
        Announcements
      </Text>
      
      <Card style={styles.announcementCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.announcementTitle}>
            Mid-Semester Break
          </Text>
          <Text variant="bodyMedium">
            Classes will be suspended from March 15-22 for mid-semester break. 
            All students are advised to use this time for personal study and reflection.
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: spacing.md,
  },
  welcomeCard: {
    marginBottom: spacing.lg,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: theme.colors.primary,
  },
  welcomeText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  studentId: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  campus: {
    color: theme.colors.onSurfaceVariant,
  },
  sectionTitle: {
    marginVertical: spacing.md,
    color: theme.colors.onSurface,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  actionCard: {
    width: '48%',
    marginBottom: spacing.md,
  },
  actionContent: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  actionIcon: {
    backgroundColor: theme.colors.primaryContainer,
    marginBottom: spacing.sm,
  },
  actionTitle: {
    textAlign: 'center',
  },
  activityCard: {
    marginBottom: spacing.lg,
  },
  announcementCard: {
    marginBottom: spacing.lg,
  },
  announcementTitle: {
    color: theme.colors.primary,
    marginBottom: spacing.sm,
  },
});

export default DashboardScreen;