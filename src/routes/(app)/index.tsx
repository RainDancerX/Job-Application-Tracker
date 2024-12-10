import { createFileRoute } from '@tanstack/react-router';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CalendarDays } from 'lucide-react';
// import { JobApplication } from '@/types';
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import { fetchApplications } from '@/lib/api';
import { auth } from '@/lib/firebase';

export const Route = createFileRoute('/(app)/')({
  loader: async () => {
    try {
      // Wait for auth to be ready
      await new Promise((resolve, reject) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe();
          if (user) {
            resolve(user);
          } else {
            reject(new Error('Please sign in to access your applications'));
          }
        });
      });

      const applications = await fetchApplications();
      return { applications };
    } catch (error) {
      console.error('Error loading applications:', error);
      throw error;
    }
  },
  component: Index,
  // Add error boundary
  errorComponent: ({ error }) => (
    <div className="flex justify-center items-center h-[50vh]">
      <p className="text-destructive">{error.message}</p>
    </div>
  ),
});

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#FF0000',
];

function Index() {
  const { applications } = Route.useLoaderData();

  // Status Distribution Data
  const statusData = applications.reduce((acc: any[], app) => {
    const existingStatus = acc.find((item) => item.name === app.status);
    if (existingStatus) {
      existingStatus.value++;
    } else {
      acc.push({ name: app.status, value: 1 });
    }
    return acc;
  }, []);

  // Industry Distribution Data
  const industryData = applications.reduce((acc: any[], app) => {
    if (!app.companyIndustry) return acc;
    const existingIndustry = acc.find(
      (item) => item.name === app.companyIndustry
    );
    if (existingIndustry) {
      existingIndustry.value++;
    } else {
      acc.push({ name: app.companyIndustry, value: 1 });
    }
    return acc;
  }, []);

  // Skills Distribution Data
  const skillsData = applications
    .reduce((acc: any[], app) => {
      app.skillsRequired?.forEach((skill) => {
        const existingSkill = acc.find((item) => item.name === skill);
        if (existingSkill) {
          existingSkill.value++;
        } else {
          acc.push({ name: skill, value: 1 });
        }
      });
      return acc;
    }, [])
    .sort((a: any, b: any) => b.value - a.value)
    .slice(0, 10); // Top 10 skills

  // Applications Over Time Data
  const timelineData = (() => {
    // Create array of all months in current year
    const currentYear = new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => {
      return {
        name: new Date(currentYear, i).toLocaleString('default', {
          month: 'short',
        }),
        count: 0,
      };
    });

    // Fill in the application counts for the current year
    applications.forEach((app) => {
      const date = new Date(app.applicationDate);
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        months[monthIndex].count++;
      }
    });

    return months;
  })();

  // Upcoming Interviews
  const upcomingInterviews = applications
    .filter(
      (app) =>
        app.status === 'Interview Scheduled' &&
        new Date(app.interviewDate) >= new Date()
    )
    .sort(
      (a, b) =>
        new Date(a.interviewDate).getTime() -
        new Date(b.interviewDate).getTime()
    );

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      {/* First Row - Status and Interviews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Status Distribution Pie Chart */}
        <div className="bg-card p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Application Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={130}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((_: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Upcoming Interviews Alerts */}
        <div className="space-y-4 min-h-[300px] md:min-h-[350px]">
          <h3 className="text-lg font-semibold">Upcoming Interviews</h3>
          <div className="overflow-y-auto max-h-[250px] md:max-h-[350px] pr-2 space-y-3">
            {upcomingInterviews.map((interview) => (
              <Alert key={interview.id}>
                <CalendarDays className="h-4 w-4" />
                <AlertTitle>{interview.companyName}</AlertTitle>
                <AlertDescription>
                  {new Date(interview.interviewDate).toLocaleDateString()} -{' '}
                  {interview.jobTitle}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row - Industry and Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Industry Distribution */}
        <div className="bg-card p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Industry Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={industryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={130}
                fill="#8884d8"
                dataKey="value"
              >
                {industryData.map((_: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Skills Distribution */}
        <div className="bg-card p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Top Skills Required</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={skillsData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Third Row - Timeline */}
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        {/* Applications Timeline */}
        <div className="bg-card p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Applications Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
