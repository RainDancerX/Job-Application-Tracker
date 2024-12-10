/*
 * @Author: lucas Liu lantasy.io@gmail.com
 * @Date: 2024-12-08 16:22:05
 * @LastEditTime: 2024-12-09 03:00:03
 * @Description:
 */
export interface OfferDetails {
  salary: string;
  benefits: string[];
  joiningDate?: string;
}

export interface JobApplication {
  id: string;
  companyName: string;
  companyIndustry?: string;
  jobTitle: string;
  location: string;
  applicationDate: string;
  jobPostingLink: string;
  status:
    | 'Applied'
    | 'Interview Scheduled'
    | 'Interviewed'
    | 'Offer'
    | 'Rejected'
    | 'Accepted';
  jobType: string;
  salaryRange: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  deadline: string;
  followUpDate: string;
  interviewDate: string;
  notes: string;
  resumeVersion: string;
  coverLetter: boolean;
  priorityLevel: 'Low' | 'Medium' | 'High';
  referral: string;
  interviewFeedback: string;
  offerDetails?: OfferDetails;
  jobDescriptionSummary: string;
  skillsRequired: string[];
  applicationPlatform: string;
}
