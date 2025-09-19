import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import {
  People,
  School,
  Payment,
  Assignment,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '1,234',
      icon: <People fontSize="large" />,
      color: '#1E88E5',
    },
    {
      title: 'Active Courses',
      value: '45',
      icon: <School fontSize="large" />,
      color: '#4CAF50',
    },
    {
      title: 'Total Revenue',
      value: '₦2.5M',
      icon: <Payment fontSize="large" />,
      color: '#FF9800',
    },
    {
      title: 'Pending Exams',
      value: '12',
      icon: <Assignment fontSize="large" />,
      color: '#F44336',
    },
  ];

  const enrollmentData = [
    { month: 'Jan', students: 100 },
    { month: 'Feb', students: 150 },
    { month: 'Mar', students: 200 },
    { month: 'Apr', students: 180 },
    { month: 'May', students: 220 },
    { month: 'Jun', students: 250 },
  ];

  const campusData = [
    { name: 'Lagos', value: 45, color: '#1E88E5' },
    { name: 'Ibadan', value: 30, color: '#4CAF50' },
    { name: 'Abuja', value: 15, color: '#FF9800' },
    { name: 'Port Harcourt', value: 10, color: '#F44336' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Student Enrollment Trend
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#1E88E5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Students by Campus
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={campusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {campusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Paper sx={{ p: 2, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <Box>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • New student registration: John Doe (Lagos Campus)
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Course "Biblical Studies 101" updated by Dr. Smith
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            • Payment received: ₦50,000 from Jane Smith
          </Typography>
          <Typography variant="body2">
            • New exam scheduled: "Theology Midterm" for March 15
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;