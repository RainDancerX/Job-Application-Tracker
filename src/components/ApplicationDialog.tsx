import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

export function ApplicationDialog({
  open,
  onOpenChange,
  application,
  onClose,
}: ApplicationDialogProps) {
  const defaultFormData: Partial<JobApplication> = {
    status: 'Applied' as const,
    priorityLevel: 'Medium' as const,
    applicationDate: new Date().toISOString().split('T')[0],
  };

  const [formData, setFormData] =
    useState<Partial<JobApplication>>(defaultFormData);

  useEffect(() => {
    if (open && application) {
      setFormData(application);
    } else if (!open) {
      setFormData(defaultFormData);
    }
  }, [open, application]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (application?.id) {
        await updateApplication(application.id, formData);
      } else {
        await addApplication(formData as Omit<JobApplication, 'id'>);
      }
      onClose();
    } catch (error) {
      console.error('Error saving application:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {application ? 'Edit Application' : 'Add Application'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName || ''}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle || ''}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as JobApplication['status'],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Applied">Applied</SelectItem>
                  <SelectItem value="Interview">Interview</SelectItem>
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
                  setFormData({
                    ...formData,
                    priorityLevel: value as JobApplication['priorityLevel'],
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

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
