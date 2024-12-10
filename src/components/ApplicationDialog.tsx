import React, { useEffect, useReducer } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { JobApplication } from '@/types';
import { addApplication, updateApplication } from '@/lib/api';

interface ApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application?: JobApplication | null;
  onClose: () => void;
}

// Define action types
type FormAction =
  | { type: 'SET_FORM_DATA'; payload: Partial<JobApplication> }
  | { type: 'UPDATE_FIELD'; field: keyof JobApplication; value: any }
  | { type: 'ADD_SKILL'; skill: string }
  | { type: 'REMOVE_SKILL'; skill: string }
  | { type: 'ADD_BENEFIT'; benefit: string }
  | { type: 'REMOVE_BENEFIT'; benefit: string }
  | { type: 'SET_SKILL_INPUT'; value: string }
  | { type: 'SET_BENEFIT_INPUT'; value: string }
  | { type: 'RESET_FORM' };

// Define state type
interface FormState {
  formData: Partial<JobApplication>;
  skillInput: string;
  benefitInput: string;
}

// Create reducer function
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FORM_DATA':
      return {
        ...state,
        formData: action.payload,
      };
    case 'UPDATE_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.field]: action.value,
        },
      };
    case 'ADD_SKILL':
      return {
        ...state,
        formData: {
          ...state.formData,
          skillsRequired: [
            ...(state.formData.skillsRequired || []),
            action.skill,
          ],
        },
        skillInput: '',
      };
    case 'REMOVE_SKILL':
      return {
        ...state,
        formData: {
          ...state.formData,
          skillsRequired: state.formData.skillsRequired?.filter(
            (skill) => skill !== action.skill
          ),
        },
      };
    case 'ADD_BENEFIT':
      return {
        ...state,
        formData: {
          ...state.formData,
          offerDetails: {
            ...(state.formData.offerDetails || {}),
            benefits: [
              ...(state.formData.offerDetails?.benefits || []),
              action.benefit,
            ],
          },
        },
        benefitInput: '',
      };
    case 'REMOVE_BENEFIT':
      return {
        ...state,
        formData: {
          ...state.formData,
          offerDetails: {
            ...(state.formData.offerDetails || {}),
            benefits:
              state.formData.offerDetails?.benefits?.filter(
                (benefit) => benefit !== action.benefit
              ) || [],
          },
        },
      };
    case 'SET_SKILL_INPUT':
      return {
        ...state,
        skillInput: action.value,
      };
    case 'SET_BENEFIT_INPUT':
      return {
        ...state,
        benefitInput: action.value,
      };
    case 'RESET_FORM':
      return {
        formData: defaultFormData,
        skillInput: '',
        benefitInput: '',
      };
    default:
      return state;
  }
}

// Move defaultFormData outside the component
const defaultFormData: Partial<JobApplication> = {
  status: 'Applied' as const,
  priorityLevel: 'Medium' as const,
  applicationDate: new Date().toISOString().split('T')[0],
  coverLetter: false,
  skillsRequired: [],
};

export function ApplicationDialog({
  open,
  onOpenChange,
  application,
  onClose,
}: ApplicationDialogProps) {
  const [state, dispatch] = useReducer(formReducer, {
    formData: defaultFormData,
    skillInput: '',
    benefitInput: '',
  });

  const { formData, skillInput, benefitInput } = state;

  // Also need to add state setters for skillInput and benefitInput
  const setSkillInput = (value: string) => {
    dispatch({ type: 'SET_SKILL_INPUT', value });
  };

  const setBenefitInput = (value: string) => {
    dispatch({ type: 'SET_BENEFIT_INPUT', value });
  };

  // Update useEffect to handle dialog state changes
  useEffect(() => {
    if (open) {
      if (application) {
        dispatch({ type: 'SET_FORM_DATA', payload: application });
      } else {
        // Reset to default when opening for a new application
        dispatch({ type: 'RESET_FORM' });
      }
    }
  }, [open, application]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (application?.id) {
        await updateApplication(application.id, formData);
      } else {
        await addApplication(formData as Omit<JobApplication, 'id'>);
      }
      handleClose();
    } catch (error) {
      console.error('Error saving application:', error);
    }
  };

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      dispatch({ type: 'ADD_SKILL', skill: skillInput.trim() });
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    dispatch({ type: 'REMOVE_SKILL', skill: skillToRemove });
  };

  const handleAddBenefit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && benefitInput.trim()) {
      e.preventDefault();
      dispatch({ type: 'ADD_BENEFIT', benefit: benefitInput.trim() });
    }
  };

  const handleRemoveBenefit = (benefitToRemove: string) => {
    dispatch({ type: 'REMOVE_BENEFIT', benefit: benefitToRemove });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          // Reset form when dialog is closed
          dispatch({ type: 'RESET_FORM' });
        }
        onOpenChange(newOpen);
      }}
    >
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
        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* First row - Company Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'companyName',
                    value: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="companyIndustry">Company Industry</Label>
              <Input
                id="companyIndustry"
                value={formData.companyIndustry || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'companyIndustry',
                    value: e.target.value,
                  })
                }
                placeholder="e.g. Technology, Healthcare"
              />
            </div>
          </div>

          {/* Second row - Job Information */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'jobTitle',
                    value: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="jobType">Job Type</Label>
              <Input
                id="jobType"
                value={formData.jobType || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'jobType',
                    value: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'location',
                    value: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="applicationDate">Application Date</Label>
              <Input
                id="applicationDate"
                type="date"
                value={formData.applicationDate || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'applicationDate',
                    value: e.target.value,
                  })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="deadline">Application Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'deadline',
                    value: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  dispatch({ type: 'UPDATE_FIELD', field: 'status', value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Interview Scheduled">
                    Interview Scheduled
                  </SelectItem>
                  <SelectItem value="Interviewed">Interviewed</SelectItem>
                  <SelectItem value="Offer">Offer</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="priorityLevel">Priority</Label>
              <Select
                value={formData.priorityLevel}
                onValueChange={(value) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'priorityLevel',
                    value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="jobPostingLink">Job Posting Link</Label>
              <Input
                id="jobPostingLink"
                type="url"
                value={formData.jobPostingLink || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'jobPostingLink',
                    value: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="salaryRange">Salary Range</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    id="salaryRangeMin"
                    type="number"
                    placeholder="Min"
                    value={formData.salaryRange?.split('-')[0] || ''}
                    onChange={(e) =>
                      dispatch({
                        type: 'UPDATE_FIELD',
                        field: 'salaryRange',
                        value: `${e.target.value}${
                          formData.salaryRange?.split('-')[1]
                            ? '-' + formData.salaryRange.split('-')[1]
                            : ''
                        }`,
                      })
                    }
                  />
                </div>
                <div>
                  <Input
                    id="salaryRangeMax"
                    type="number"
                    placeholder="Max"
                    value={formData.salaryRange?.split('-')[1] || ''}
                    onChange={(e) =>
                      dispatch({
                        type: 'UPDATE_FIELD',
                        field: 'salaryRange',
                        value: `${
                          formData.salaryRange?.split('-')[0] || ''
                        }${e.target.value ? '-' + e.target.value : ''}`,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'contactPerson',
                    value: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'contactEmail',
                    value: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'contactPhone',
                    value: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="followUpDate">Follow-up Date</Label>
              <Input
                id="followUpDate"
                type="date"
                value={formData.followUpDate || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'followUpDate',
                    value: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="interviewDate">Interview Date</Label>
              <Input
                id="interviewDate"
                type="date"
                value={formData.interviewDate || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'interviewDate',
                    value: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="jobDescriptionSummary">
              Job Description Summary
            </Label>
            <Textarea
              id="jobDescriptionSummary"
              value={formData.jobDescriptionSummary || ''}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'jobDescriptionSummary',
                  value: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'notes',
                  value: e.target.value,
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="resumeVersion">Resume Version</Label>
              <Input
                id="resumeVersion"
                value={formData.resumeVersion || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'resumeVersion',
                    value: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="referral">Referral</Label>
              <Input
                id="referral"
                value={formData.referral || ''}
                onChange={(e) =>
                  dispatch({
                    type: 'UPDATE_FIELD',
                    field: 'referral',
                    value: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div>
            <Label htmlFor="applicationPlatform">Application Platform</Label>
            <Input
              id="applicationPlatform"
              value={formData.applicationPlatform || ''}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'applicationPlatform',
                  value: e.target.value,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="skillsRequired">Skills Required</Label>
            <div className="space-y-2">
              <Input
                id="skillsRequired"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Type a skill and press Enter"
              />
              <div className="flex flex-wrap gap-2">
                {formData.skillsRequired?.map((skill) => (
                  <span
                    key={skill}
                    className="bg-secondary px-2 py-1 rounded-md flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {(formData.status === 'Offer' || formData.status === 'Accepted') && (
            <div className="space-y-4 border rounded-lg p-4">
              <h3 className="font-medium">Offer Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="offerSalary">Offered Salary</Label>
                  <Input
                    id="offerSalary"
                    value={formData.offerDetails?.salary || ''}
                    onChange={(e) =>
                      dispatch({
                        type: 'UPDATE_FIELD',
                        field: 'offerDetails',
                        value: {
                          ...(formData.offerDetails || {}),
                          salary: e.target.value,
                          benefits: formData.offerDetails?.benefits || [],
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="offerJoiningDate">Joining Date</Label>
                  <Input
                    id="offerJoiningDate"
                    type="date"
                    value={formData.offerDetails?.joiningDate || ''}
                    onChange={(e) =>
                      dispatch({
                        type: 'UPDATE_FIELD',
                        field: 'offerDetails',
                        value: {
                          ...(formData.offerDetails || {}),
                          joiningDate: e.target.value,
                          benefits: formData.offerDetails?.benefits || [],
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="offerBenefits">Benefits</Label>
                <div className="space-y-2">
                  <Input
                    id="offerBenefits"
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyDown={handleAddBenefit}
                    placeholder="Type a benefit and press Enter"
                  />
                  <div className="flex flex-wrap gap-2">
                    {formData.offerDetails?.benefits?.map((benefit) => (
                      <span
                        key={benefit}
                        className="bg-secondary px-2 py-1 rounded-md flex items-center gap-1"
                      >
                        {benefit}
                        <button
                          type="button"
                          onClick={() => handleRemoveBenefit(benefit)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="coverLetter"
              checked={formData.coverLetter || false}
              onChange={(e) =>
                dispatch({
                  type: 'UPDATE_FIELD',
                  field: 'coverLetter',
                  value: e.target.checked,
                })
              }
            />
            <Label htmlFor="coverLetter">Cover Letter Included</Label>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
