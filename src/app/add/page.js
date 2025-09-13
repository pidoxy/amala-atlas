
import SubmissionForm from '../../components/SubmissionForm';
import ThemeToggle from '../../components/ThemeToggle';
import Link from 'next/link';

export default function AddSpotPage() {
  return (
    <div className="container mx-auto px-4 py-8 bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <Link href="/" className="text-2xl font-bold text-foreground hover:opacity-80 transition-opacity">
          ← Amala Atlas
        </Link>
        <ThemeToggle />
      </header>
      
      <main>
        <SubmissionForm />
      </main>
    </div>
  );
}