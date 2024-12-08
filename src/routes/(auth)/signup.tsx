import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import React from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';

type SignupSearchParams = {
  redirect: string;
};

export const Route = createFileRoute('/(auth)/signup')({
  validateSearch: (search: Record<string, unknown>): SignupSearchParams => {
    return {
      redirect: (search.redirect as string) || '/',
    };
  },
  beforeLoad: ({ context }) => {
    console.log('Loading signup page...', context.auth);
    if (context.auth.isAuthenticated === true) {
      throw redirect({
        to: '/',
        search: {},
      });
    }
    return null;
  },
  component: SignupPage,
});

const fallback = '/' as const;

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  password: HTMLInputElement;
}

interface SignupFormElementProps extends HTMLFormElement {
  readonly elements: FormElements;
}

function SignupPage() {
  const navigate = Route.useNavigate();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(event: React.FormEvent<SignupFormElementProps>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const email = event.currentTarget.elements.email.value;
      const password = event.currentTarget.elements.password.value;
      await createUserWithEmailAndPassword(auth, email, password);
      await navigate({
        to: '/',
        search: {
          redirect: '/',
        },
      });
    } catch (error) {
      console.error('Error signing up:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="flex items-center justify-center w-full h-full">
      <div className="grid gap-6 max-w-lg max-h-56">
        <form onSubmit={onSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                placeholder="Enter your password"
                type="password"
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
                disabled={isLoading}
              />
            </div>
            <Button disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
