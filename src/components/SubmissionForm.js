// File: src/components/SubmissionForm.js
"use client"; 

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SubmissionForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW: State management for our de-duplication agent
  const [spotName, setSpotName] = useState('');
  const [duplicateStatus, setDuplicateStatus] = useState({
    checking: false,
    isDuplicate: false,
    message: ''
  });

  // NEW: This effect runs our agent in the background as the user types
  useEffect(() => {
    // This timeout prevents sending a request on every single keystroke
    const handler = setTimeout(async () => {
      // Don't check if the name is too short to be meaningful
      if (spotName.length < 3) {
        setDuplicateStatus({ checking: false, isDuplicate: false, message: '' });
        return;
      }

      setDuplicateStatus({ ...duplicateStatus, checking: true, message: 'Checking for duplicates...' });

      try {
        const response = await fetch('/api/check-duplicates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: spotName }),
        });
        const result = await response.json();
        
        if (result.isDuplicate) {
          setDuplicateStatus({ checking: false, isDuplicate: true, message: `⚠️ This might be the same as "${result.suggestion}"` });
        } else {
          setDuplicateStatus({ checking: false, isDuplicate: false, message: '✅ Looks new!' });
        }
      } catch (error) {
        // If the check fails, just reset silently
        setDuplicateStatus({ checking: false, isDuplicate: false, message: '' });
      }
    }, 500); // Wait 500ms after the user stops typing

    // Cleanup function: if the user types again, cancel the previous timeout
    return () => {
      clearTimeout(handler);
    };
  }, [spotName]); // This effect re-runs only when 'spotName' changes

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());    
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setSubmitted(true);
      } else {
        alert('Submission failed. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // This is the "Thank You" screen (your design)
  if (submitted) {
    return (
      <div className="text-center max-w-xl mx-auto py-12 bg-card border border-border rounded-xl shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-4 text-card-foreground">Thank you for your submission!</h1>
        <p className="text-muted-foreground mb-8 text-lg">Your Amala spot has been successfully submitted and is under review.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg">
            View on Map
          </Link>
          <button 
            onClick={() => { setSubmitted(false); setSpotName(''); }} 
            className="bg-secondary text-secondary-foreground font-bold py-3 px-6 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
          >
            Add Another Spot
          </button>
        </div>
      </div>
    );
  }

  // This is the main form (your design)
  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto py-12 bg-card border border-border rounded-xl shadow-lg p-8">
      <h1 className="text-4xl font-bold mb-8 text-card-foreground">Add a New Amala Spot</h1>
      
      <div className="mb-6">
        <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2">Name of Spot</label>
        <input 
          type="text" 
          name="name" 
          id="name" 
          required 
          className="w-full px-4 py-3 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 placeholder:text-muted-foreground" 
          placeholder="e.g. Mama's Kitchen" 
          value={spotName}
          onChange={(e) => setSpotName(e.target.value)} // Connect input to our state
        />
        {/* NEW: Dynamic feedback from the agent */}
        <p className={`text-xs mt-2 h-4 ${duplicateStatus.isDuplicate ? 'text-amber-500' : 'text-green-500'}`}>
          {duplicateStatus.message}
        </p>
      </div>
      
      {/* ... Rest of your form is unchanged ... */}
      <div className="mb-6">
        <label htmlFor="address" className="block text-sm font-medium text-card-foreground mb-2">Address</label>
        <input type="text" name="address" id="address" required className="w-full px-4 py-3 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 placeholder:text-muted-foreground" placeholder="e.g. 123 Main Street, City" />
      </div>
      
      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-card-foreground mb-2">Short Description</label>
        <textarea name="description" id="description" rows="4" required className="w-full px-4 py-3 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 placeholder:text-muted-foreground resize-vertical" placeholder="Describe the spot in a few words"></textarea>
      </div>

      <div className="mb-8">
        <h3 className="block text-sm font-medium text-card-foreground mb-4">Options</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <label className="flex items-center cursor-pointer"><input type="checkbox" name="category" value="Dine-in" className="h-4 w-4 mr-3 text-primary border-input rounded focus:ring-2 focus:ring-ring" /> <span className="text-card-foreground">Dine-in</span></label>
          <label className="flex items-center cursor-pointer"><input type="checkbox" name="category" value="Takeaway" className="h-4 w-4 mr-3 text-primary border-input rounded focus:ring-2 focus:ring-ring" /> <span className="text-card-foreground">Takeaway</span></label>
        </div>
      </div>
      
      <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg">
        {isSubmitting ? 'Submitting...' : 'Submit for Review'}
      </button>
    </form>
  );
}