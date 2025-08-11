import React, { useState, useEffect } from 'react';
import { autocreatePost, getUserPreferences, updateUserPreferences } from '../services/api';

const Trends = ({ onPostCreated }) => {
  const [keyword, setKeyword] = useState('');
  const [geo, setGeo] = useState('US');
  const [preferredTime, setPreferredTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // We'll use a new state to store the user's saved time preference for display
  const [savedTime, setSavedTime] = useState(null);

  // Fetch the user's saved preference on component load
  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const response = await getUserPreferences();
        if (response.data && response.data.preferred_post_times && response.data.preferred_post_times.length > 0) {
          setSavedTime(response.data.preferred_post_times[0]);
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };
    fetchUserPreferences();
  }, []);

  const handleAutocreate = async (e) => {
    e.preventDefault();
    if (!keyword || !geo) {
      setMessage('Please enter a keyword and select a location.');
      return;
    }
    setLoading(true);
    setMessage('');
    
    try {
      // The backend will now handle checking the preferred time
      await autocreatePost({ keyword, geo });
      setMessage('Post successfully created and scheduled! Check your Scheduled Posts.');
      setKeyword('');
      onPostCreated(); 
    } catch (error) {
      setMessage('Failed to create post. Please check your inputs and try again.');
      console.error('Error in autocreate process:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetTime = async () => {
    if (!preferredTime) {
      setMessage('Please select a time to save.');
      return;
    }
    setMessage('');
    try {
      // Save the single preferred time to the database
      // The backend logic is now corrected to handle this payload
      await updateUserPreferences({ preferred_post_time: preferredTime });
      setSavedTime(preferredTime); // Update the local state
      setMessage('Preferred posting time saved!');
    } catch (error) {
      setMessage('Failed to save preferred time.');
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md w-full">
      <h2 className="text-xl font-semibold mb-4">Content Assistant</h2>
      <p className="text-gray-400 mb-4">
        Generate and schedule a post automatically based on a keyword.
      </p>
      <form onSubmit={handleAutocreate} className="space-y-4">
        <div>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a keyword (e.g., 'AI')"
          />
        </div>
        <div>
          <select
            value={geo}
            onChange={(e) => setGeo(e.target.value)}
            className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="US">United States</option>
            <option value="NG">Nigeria</option>
            <option value="UK">United Kingdom</option>
            <option value="IN">India</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Generating...' : 'Autocreate Post'}
        </button>
      </form>
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Set Your Preferred Post Time</h3>
        <p className="text-gray-400 text-sm mb-2">This will be used for all new scheduled posts.</p>
        <div className="flex space-x-2">
          <input
            type="time"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSetTime}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
        {savedTime && (
          <p className="mt-2 text-sm text-green-400">
            Current preferred time: {savedTime}
          </p>
        )}
      </div>
      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
};

export default Trends;
