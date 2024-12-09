/*
 * @Author: lucas Liu lantasy.io@gmail.com
 * @Date: 2024-12-08 16:15:40
 * @LastEditTime: 2024-12-08 16:36:36
 * @Description:
 */
import { createFileRoute } from '@tanstack/react-router';
import { fetchApplications, deleteApplication } from '@/lib/api';
import type { JobApplication } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ApplicationDialog } from '@/components/ApplicationDialog';
import { Timestamp } from 'firebase/firestore';

export const Route = createFileRoute('/(app)/applications')({
  loader: fetchApplications,
  component: ApplicationsPage,
});

function formatDate(date: Timestamp | string) {
  if (date instanceof Timestamp) {
    return date.toDate().toLocaleDateString();
  }
  return date;
}

function ApplicationsPage() {
  const applications = Route.useLoaderData() as JobApplication[];
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplication | null>(null);

  const handleEdit = (application: JobApplication) => {
    setSelectedApplication(application);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      await deleteApplication(id);
      // Refresh the page to reload the data
      window.location.reload();
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Applications</h1>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application.id}>
              <TableCell>{application.companyName}</TableCell>
              <TableCell>{application.jobTitle}</TableCell>
              <TableCell>{application.status}</TableCell>
              <TableCell>{formatDate(application.applicationDate)}</TableCell>
              <TableCell>{application.priorityLevel}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(application)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(application.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ApplicationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        application={selectedApplication}
        onClose={() => {
          setSelectedApplication(null);
          setIsDialogOpen(false);
          window.location.reload();
        }}
      />
    </div>
  );
}
