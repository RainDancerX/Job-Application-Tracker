/*
 * @Author: lucas Liu lantasy.io@gmail.com
 * @Date: 2024-12-08 16:15:40
 * @LastEditTime: 2024-12-09 16:51:35
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
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { ApplicationDialog } from '@/components/ApplicationDialog';
import { Timestamp } from 'firebase/firestore';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
// import { useAuth } from '@/hooks/useAuth';
import { auth } from '@/lib/firebase';

interface LoaderData {
  applications: JobApplication[];
  isLoading: boolean;
}

export const Route = createFileRoute('/(app)/applications')({
  loader: async (): Promise<LoaderData> => {
    try {
      // Wait for auth to be ready
      await new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe();
          resolve(user);
        });
      });

      const applications = await fetchApplications();
      return { applications, isLoading: false };
    } catch (error) {
      console.error('Error loading applications:', error);
      throw error;
    }
  },
  component: ApplicationsPage,
  errorComponent: ({ error }) => (
    <div className="flex justify-center items-center h-[50vh]">
      <p className="text-destructive">{error.message}</p>
    </div>
  ),
});

function formatDate(date: Timestamp | string) {
  if (date instanceof Timestamp) {
    return date.toDate().toLocaleDateString();
  }
  return date;
}

function getStatusColor(status: JobApplication['status']) {
  switch (status) {
    case 'Applied':
      return 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950';
    case 'Interview Scheduled':
      return 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950';
    case 'Interviewed':
      return 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950';
    case 'Offer':
      return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950';
    case 'Accepted':
      return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950';
    case 'Rejected':
      return 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950';
    default:
      return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-950';
  }
}

function getPriorityColor(priority: JobApplication['priorityLevel']) {
  switch (priority) {
    case 'High':
      return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950';
    case 'Medium':
      return 'text-sky-600 bg-sky-50 dark:text-sky-400 dark:bg-sky-950';
    case 'Low':
      return 'text-slate-600 bg-slate-50 dark:text-slate-400 dark:bg-slate-950';
    default:
      return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-950';
  }
}

function ApplicationsPage() {
  const { applications, isLoading } = Route.useLoaderData() as LoaderData;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] =
    useState<JobApplication | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Calculate pagination values
  const totalPages = Math.ceil(applications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = applications.slice(startIndex, endIndex);

  const handleEdit = (application: JobApplication) => {
    setSelectedApplication(application);
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedApplication(null);
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    setSelectedApplication(null);
    setIsDialogOpen(false);
    window.location.reload();
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
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Application
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Job Title</TableHead>
            <TableHead>Job Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentApplications.map((application) => (
            <TableRow key={application.id}>
              <TableCell>{application.companyName}</TableCell>
              <TableCell>{application.jobTitle}</TableCell>
              <TableCell>{application.jobType}</TableCell>
              <TableCell>{application.location}</TableCell>
              <TableCell>
                <span
                  className={`inline-block px-2 py-1 rounded-md text-sm font-medium ${getStatusColor(
                    application.status
                  )}`}
                >
                  {application.status}
                </span>
              </TableCell>
              <TableCell>{formatDate(application.applicationDate)}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-md text-sm font-medium ${getPriorityColor(
                    application.priorityLevel
                  )}`}
                >
                  {application.priorityLevel}
                </span>
              </TableCell>
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

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.max(1, p - 1));
                  }}
                  className={
                    currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(i + 1);
                    }}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                  }}
                  className={
                    currentPage === totalPages
                      ? 'pointer-events-none opacity-50'
                      : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <ApplicationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        application={selectedApplication}
        onClose={handleClose}
      />
    </div>
  );
}
