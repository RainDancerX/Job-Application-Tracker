export interface OfferDetails {
  salary: string;
  benefits: string[];
  joiningDate: string;
}

export interface JobApplication {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  applicationDate: string;
  jobPostingLink: string;
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected' | 'Accepted';
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
