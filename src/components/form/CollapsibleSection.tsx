/*
 * @Author: lucas Liu lantasy.io@gmail.com
 * @Date: 2024-12-14 02:38:41
 * @LastEditTime: 2024-12-14 03:29:57
 * @Description:
 */
import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function CollapsibleSection({
  title,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="border rounded-lg p-5">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left"
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <ChevronDown
          className={cn(
            'h-5 w-5 transition-transform',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>
      <div
        className={cn(
          'grid gap-4 overflow-hidden transition-all',
          isOpen ? 'mt-4 grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="min-h-0 pt-0 pr-2 pb-2 pl-2">{children}</div>
      </div>
    </div>
  );
}
