/*
 * @Author: lucas Liu lantasy.io@gmail.com
 * @Date: 2024-12-14 02:56:08
 * @LastEditTime: 2024-12-14 02:58:12
 * @Description:
 */
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';

export const applicationSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  companyIndustry: z.string().optional(),
  jobTitle: z.string().min(1, 'Job title is required'),
  jobType: z.string().optional(),
  location: z.string().optional(),
  applicationDate: z.string().min(1, 'Application date is required'),
  deadline: z.string().optional(),
  status: z.enum([
    'Applied',
    'Interview Scheduled',
    'Interviewed',
    'Offer',
    'Rejected',
    'Accepted',
  ]),
  priorityLevel: z.enum(['Low', 'Medium', 'High']),
  jobPostingLink: z.string().url().optional().or(z.literal('')),
  salaryRangeMin: z.string().default(''),
  salaryRangeMax: z.string().default(''),
  contactPerson: z.string().default(''),
  contactEmail: z.string().email().optional().or(z.literal('')),
  contactPhone: z.string().default(''),
  followUpDate: z.string().default(''),
  interviewDate: z.string().default(''),
  jobDescriptionSummary: z.string().default(''),
  notes: z.string().default(''),
  resumeVersion: z.string().default(''),
  referral: z.string().default(''),
  applicationPlatform: z.string().default(''),
  coverLetter: z.boolean().default(false),
  skillsRequired: z.array(z.string()).default([]),
  offerDetails: z
    .object({
      salary: z.string().default(''),
      benefits: z.array(z.string()).default([]),
      joiningDate: z.string().default(''),
    })
    .default({
      salary: '',
      benefits: [],
      joiningDate: '',
    }),
});

export type FormValues = z.infer<typeof applicationSchema>;

export interface FormSectionProps {
  form: UseFormReturn<FormValues>;
}
