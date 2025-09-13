import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '../api/auth/[...nextauth]/route.js';
import LoginForm from '../../components/LoginForm';

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-foreground">
            Sign in to Amala Atlas
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Write reviews, track your contributions, and help build the best amala map
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
