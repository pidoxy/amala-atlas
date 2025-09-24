"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function UploaderPage() {
  const [jsonData, setJsonData] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    setIsLoading(true);
    setMessage('');

    let spots;
    try {
      // First, parse the JSON to make sure it's valid
      spots = JSON.parse(jsonData);
      if (!Array.isArray(spots)) {
        throw new Error('The JSON must be an array of spot objects.');
      }
    } catch (error) {
      setMessage(`Error: Invalid JSON format. ${error.message}`);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/bulk-add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spots: spots }), // Send in the expected format
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`Success! ${result.message}`);
      } else {
        setMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setMessage('An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-background text-foreground min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Admin Data Uploader</h1>
        <Link href="/admin" className="text-primary hover:underline">&larr; Back to Moderation</Link>
      </header>

      <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-2">Paste your JSON array of spots here:</h2>
        <p className="text-muted-foreground mb-4">This will add all spots to the live Firestore database. Use with care.</p>
        
        <textarea
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          placeholder='[ { "id": "1", "name": "Amala Spot", ... }, ... ]'
          className="w-full h-80 p-4 font-mono bg-background text-foreground border border-input rounded-lg focus:ring-2 focus:ring-ring"
        />

        <button
          onClick={handleUpload}
          disabled={isLoading || !jsonData}
          className="mt-4 bg-primary text-primary-foreground font-bold py-3 px-6 rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Uploading...' : 'Upload to Firestore'}
        </button>

        {message && (
          <div className="mt-4 p-4 rounded-lg border bg-secondary text-secondary-foreground">
            <p>{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}