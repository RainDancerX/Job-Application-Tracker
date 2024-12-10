/*
 * @Author: lucas Liu lantasy.io@gmail.com
 * @Date: 2024-11-12 15:29:13
 * @LastEditTime: 2024-12-09 00:54:13
 * @Description:
 */
import { Link } from '@/components/ui/link';
import { AuthContext } from '@/hooks/useAuth';
import {
  createRootRouteWithContext,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { User, Rocket, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

interface RouterContext {
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: ({ context, location }) => {
    // Don't redirect if already on login page or signup page
    if (
      !context.auth.isAuthenticated &&
      !location.pathname.includes('/login') &&
      !location.pathname.includes('/signup')
    ) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: RootComponent,
});

function RootComponent() {
  const { auth } = Route.useRouteContext();
  // const navigate = Route.useNavigate();

  return (
    <>
      {auth.isAuthenticated && (
        <nav className="flex items-center border-b border-muted py-2 px-6 gap-6">
          <section className="flex items-center justify-start">
            <Link to="/">
              <span className="flex items-center justify-start gap-1">
                <Rocket className="w-6 h-6" />
                <span className="font-medium text-xl">
                  Job Application Tracker
                </span>
              </span>
            </Link>
          </section>
          <section className="inline-flex items-center justify-start gap-4 p-2 flex-grow">
            {/* <Link
              to="/categories/$category"
              usage="nav"
            >
              Dashboard
            </Link> */}
            <Link to="/applications" usage="nav">
              Applications
            </Link>
          </section>
          <section className="flex items-center justify-end gap-4">
            <Link to="/profile" variant="button">
              <User className="text-lg" />
            </Link>
            <Dialog>
              <DialogTrigger asChild>
                <span className="hover:text-red-500 cursor-pointer">
                  <LogOut className="text-lg" />
                </span>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Sign Out</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to sign out?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      variant="default"
                      onClick={async () => {
                        await auth.logout();
                        window.location.href = '/JAT/login';
                        // navigate({
                        //   to: '/login',
                        //   search: {
                        //     redirect: '/JAT/login',
                        //   },
                        // });
                      }}
                    >
                      Sign Out
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </section>
        </nav>
      )}
      <main className="flex-grow">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </>
  );
}
