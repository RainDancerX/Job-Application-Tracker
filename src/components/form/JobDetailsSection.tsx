import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormSectionProps } from './types';
import { useState } from 'react';

export function JobDetailsSection({ form }: FormSectionProps) {
  const [skillInput, setSkillInput] = useState('');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="jobTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Type</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Full-time, Contract" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="jobDescriptionSummary"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Description Summary</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="skillsRequired"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Skills Required</FormLabel>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {field.value?.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="bg-secondary px-2 py-1 rounded-md flex items-center gap-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange(
                          field.value.filter((_, i) => i !== index)
                        );
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <FormControl>
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Type a skill and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = skillInput.trim();
                      if (value && !field.value?.includes(value)) {
                        field.onChange([...(field.value || []), value]);
                        setSkillInput('');
                      }
                    }
                  }}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="jobPostingLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Posting Link</FormLabel>
              <FormControl>
                <Input type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <FormLabel>Salary Range</FormLabel>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="salaryRangeMin"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="number" placeholder="Min" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salaryRangeMax"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} type="number" placeholder="Max" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
