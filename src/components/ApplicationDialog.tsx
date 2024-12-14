import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { JobApplication } from '@/types';
import { addApplication, updateApplication } from '@/lib/api';
import { Form } from '@/components/ui/form';
import { CollapsibleSection } from './form/CollapsibleSection';
import { CompanySection } from './form/CompanySection';
import { JobDetailsSection } from './form/JobDetailsSection';
import { ApplicationDetailsSection } from './form/ApplicationDetailsSection';
import { OfferDetailsSection } from './form/OfferDetailsSection';
import { applicationSchema, FormValues } from './form/types';

export interface ApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application?: JobApplication | null;
  onClose: () => void;
}

// defaultFormData
const defaultFormData: FormValues = {
  companyName: '',
  jobTitle: '',
  companyIndustry: '',
  jobType: '',
  location: '',
  status: 'Applied',
  priorityLevel: 'Medium',
  applicationDate: new Date().toISOString().split('T')[0],
  deadline: '',
  jobPostingLink: '',
  contactPerson: '',
  contactEmail: '',
  contactPhone: '',
  followUpDate: '',
  interviewDate: '',
  jobDescriptionSummary: '',
  notes: '',
  resumeVersion: '',
  referral: '',
  applicationPlatform: '',
  coverLetter: false,
  skillsRequired: [],
  salaryRangeMin: '',
  salaryRangeMax: '',
  offerDetails: {
    salary: '',
    benefits: [],
    joiningDate: '',
  },
};

export function ApplicationDialog({
  open,
  onOpenChange,
  application,
  onClose,
}: ApplicationDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: defaultFormData,
  });

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      if (application) {
        // Transform the salary range data
        const [min, max] = application.salaryRange?.split('-') || ['', ''];
        form.reset({
          ...application,
          salaryRangeMin: min,
          salaryRangeMax: max,
          offerDetails: application.offerDetails || {
            salary: '',
            benefits: [],
            joiningDate: '',
          },
        } as FormValues);
      } else {
        form.reset(defaultFormData);
      }
    }
  }, [open, application, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      // Create submission data without undefined values
      const { salaryRangeMin, salaryRangeMax, ...rest } = data;
      const submissionData = {
        ...rest,
        salaryRange:
          salaryRangeMin && salaryRangeMax
            ? `${salaryRangeMin}-${salaryRangeMax}`
            : '',
      };

      if (application?.id) {
        await updateApplication(application.id, submissionData);
      } else {
        await addApplication(submissionData as Omit<JobApplication, 'id'>);
      }
      onClose();
    } catch (error) {
      console.error('Error saving application:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {application ? 'Edit Application' : 'Add Application'}
          </DialogTitle>
          <DialogDescription>
            {application
              ? 'Update the details of your job application.'
              : 'Fill in the details of your new job application.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CollapsibleSection title="Company Information">
              <CompanySection form={form} />
            </CollapsibleSection>

            <CollapsibleSection title="Job Details">
              <JobDetailsSection form={form} />
            </CollapsibleSection>

            <CollapsibleSection title="Application Details">
              <ApplicationDetailsSection form={form} />
            </CollapsibleSection>

            {(form.watch('status') === 'Offer' ||
              form.watch('status') === 'Accepted') && (
              <CollapsibleSection title="Offer Details" defaultOpen={true}>
                <OfferDetailsSection form={form} />
              </CollapsibleSection>
            )}

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
