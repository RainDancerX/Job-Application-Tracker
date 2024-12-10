import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import React from 'react';
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Link } from '@tanstack/react-router';

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

// const fallback = '/' as const;

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
  const [errors, setErrors] = React.useState<{
    email?: string;
    password?: string;
  }>({});
  const { toast } = useToast();

  const validateForm = (email: string, password: string) => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function onSubmit(event: React.FormEvent<SignupFormElementProps>) {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    const email = event.currentTarget.elements.email.value;
    const password = event.currentTarget.elements.password.value;

    if (!validateForm(email, password)) {
      setIsLoading(false);
      return;
    }

    try {
      // Check if email already exists
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        setErrors({ email: 'This email is already registered' });
        toast({
          variant: 'destructive',
          title: 'Sign up failed',
          description:
            'This email is already registered. Please use a different email or try logging in.',
        });
        setIsLoading(false);
        return;
      }

      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: 'Account created successfully!',
        description: 'You can now start tracking your job applications.',
      });
      await navigate({
        to: '/',
        search: {
          redirect: '/',
        },
      });
    } catch (error: any) {
      console.error('Error signing up:', error);
      let errorMessage = 'An error occurred during sign up';

      // Handle specific Firebase error codes
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        default:
          errorMessage = error.message || 'An error occurred during sign up';
      }

      toast({
        variant: 'destructive',
        title: 'Sign up failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="flex items-center justify-center w-full h-full">
      <div className="grid gap-6 w-full max-w-sm">
        <form onSubmit={onSubmit}>
          <div className="grid gap-4">
            <div className="grid gap-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                className="h-11"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="Enter your password (min. 8 characters)"
                type="password"
                autoCapitalize="none"
                autoComplete="new-password"
                autoCorrect="off"
                disabled={isLoading}
                className="h-11"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>
            <Button disabled={isLoading} className="h-11">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </Button>
          </div>
        </form>
        <div className="flex justify-center">
          <Link
            to="/login"
            search={{ redirect: '/' }}
            className="text-primary underline-offset-4 hover:underline"
          >
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </section>
  );
}
