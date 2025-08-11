import React, { useState } from 'react';
import { schedulePost } from '../services/api';

const PostCreator = ({ userId, onPostCreated }) => {
  const [postText, setPostText] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postText || !scheduledDate) {
      setMessage('Post content and scheduled date are required.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formattedDate = new Date(scheduledDate).toISOString();
      await schedulePost({ text: postText, scheduledDate: formattedDate });
      setMessage('Post scheduled successfully!');
      setPostText('');
      setScheduledDate('');
      onPostCreated();
    } catch (error) {
      setMessage('Failed to schedule post.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">Schedule a New Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What's happening?"
            rows="4"
            maxLength="280"
          />
        </div>
        <div>
          <input
            type="datetime-local"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Scheduling...' : 'Schedule Post'}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
};

export default PostCreator;
