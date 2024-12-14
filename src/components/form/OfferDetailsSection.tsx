import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormSectionProps } from './types';
import { useState } from 'react';

export function OfferDetailsSection({ form }: FormSectionProps) {
  const [benefitInput, setBenefitInput] = useState('');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="offerDetails.salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offered Salary</FormLabel>
              <FormControl>
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="offerDetails.joiningDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Joining Date</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="offerDetails.benefits"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Benefits</FormLabel>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {field.value?.map((benefit: string, index: number) => (
                  <span
                    key={index}
                    className="bg-secondary px-2 py-1 rounded-md flex items-center gap-1"
                  >
                    {benefit}
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
                  value={benefitInput}
                  onChange={(e) => setBenefitInput(e.target.value)}
                  placeholder="Type a benefit and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const value = benefitInput.trim();
                      if (value && !field.value?.includes(value)) {
                        field.onChange([...(field.value || []), value]);
                        setBenefitInput('');
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
    </div>
  );
}
