// File: src/components/SubmissionForm.js
"use client"; 

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ImageUpload from './ImageUpload';

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

  // Image upload state
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  // NEW: This effect runs our agent in the background as the user types
  useEffect(() => {
    // This timeout prevents sending a request on every single keystroke
    const handler = setTimeout(async () => {
      // Don't check if the name is too short to be meaningful
      if (spotName.length < 3) {
        setDuplicateStatus({ checking: false, isDuplicate: false, message: '' });
        return;
      }

      setDuplicateStatus(prev => ({ ...prev, checking: true, message: 'Checking for duplicates...' }));

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

  const handleImageSelect = async (file) => {
    if (!file) {
      setSelectedImage(null);
      setImageUrl('');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setImageUrl(result.url);
        setSelectedImage(file);
      } else {
        alert('Image upload failed. Please try again.');
      }
    } catch (error) {
      alert('Image upload failed. Please try again.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    
    // Add the uploaded image URL to the data
    if (imageUrl) {
      data.image_url = imageUrl;
    }
    
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
        {/* UPDATED: New line to manage expectations */}
        <p className="text-muted-foreground mb-8 text-lg">
          Your Amala spot is under review. Once approved by our moderators, it will appear live on the map.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* UPDATED: Changed the text of the primary button */}
          <Link href="/" className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg">
            Explore the Map
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
  
  {/* --- NAME OF SPOT (UNCHANGED BUT INCLUDED FOR CONTEXT) --- */}
  <div className="mb-6">
    <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2">Name of Spot</label>
    <input 
      type="text" name="name" id="name" required 
      className="w-full px-4 py-3 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring" 
      placeholder="e.g. Mama's Kitchen" 
      value={spotName}
      onChange={(e) => setSpotName(e.target.value)}
    />
    <p className={`text-xs mt-2 h-4 ${duplicateStatus.isDuplicate ? 'text-amber-500' : 'text-green-500'}`}>{duplicateStatus.message}</p>
  </div>
  
  {/* --- ADDRESS (UNCHANGED) --- */}
  <div className="mb-6">
    <label htmlFor="address" className="block text-sm font-medium text-card-foreground mb-2">Address</label>
    <input type="text" name="address" id="address" required className="w-full px-4 py-3 bg-background text-foreground border border-input rounded-lg" placeholder="e.g. 123 Main Street, City" />
  </div>

  {/* --- NEW FIELD: PRICE BAND --- */}
  <div className="mb-6">
    <label htmlFor="price_band" className="block text-sm font-medium text-card-foreground mb-2">Price Band</label>
    <select 
      name="price_band" 
      id="price_band" 
      required 
      className="w-full px-4 py-3 bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-ring"
    >
      <option value="">Select a price range</option>
      <option value="₦">₦ (Affordable)</option>
      <option value="₦₦">₦₦ (Mid-range)</option>
      <option value="₦₦₦">₦₦₦ (Premium)</option>
    </select>
  </div>

  {/* --- NEW FIELD: HOURS --- */}
  <div className="mb-6">
    <label htmlFor="hours" className="block text-sm font-medium text-card-foreground mb-2">Operating Hours</label>
    <input type="text" name="hours" id="hours" className="w-full px-4 py-3 bg-background text-foreground border border-input rounded-lg" placeholder="e.g. 10 AM - 9 PM" />
  </div>

  {/* --- NEW FIELD: PHOTO UPLOAD --- */}
  <div className="mb-6">
    <ImageUpload 
      onImageSelect={handleImageSelect}
      label="Photo (Optional)"
    />
  </div>
  
  {/* --- DESCRIPTION (UNCHANGED) --- */}
  <div className="mb-6">
    <label htmlFor="description" className="block text-sm font-medium text-card-foreground mb-2">Short Description</label>
    <textarea name="description" id="description" rows="4" required className="w-full px-4 py-3 bg-background text-foreground border border-input rounded-lg resize-vertical" placeholder="Describe the spot in a few words"></textarea>
  </div>

  {/* --- OPTIONS & AMALA FOCUS CHECKBOX --- */}
  <div className="mb-8 space-y-4">
    <h3 className="block text-sm font-medium text-card-foreground">Options</h3>
    <div className="flex flex-col sm:flex-row gap-4">
      <label className="flex items-center cursor-pointer"><input type="checkbox" name="category" value="Dine-in" className="h-4 w-4 mr-3 text-primary border-input rounded" /> <span className="text-card-foreground">Dine-in</span></label>
      <label className="flex items-center cursor-pointer"><input type="checkbox" name="category" value="Takeaway" className="h-4 w-4 mr-3 text-primary border-input rounded" /> <span className="text-card-foreground">Takeaway</span></label>
    </div>
    {/* --- NEW FIELD: AMALA FOCUS --- */}
    <label className="flex items-center cursor-pointer pt-2">
      <input type="checkbox" name="amala_focus" value="true" className="h-4 w-4 mr-3 text-primary border-input rounded" /> 
      <span className="text-card-foreground font-medium">This spot is well-known for its Amala</span>
    </label>
  </div>
  
  <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50">
    {isSubmitting ? 'Submitting...' : 'Submit for Review'}
  </button>
</form>
  );
}