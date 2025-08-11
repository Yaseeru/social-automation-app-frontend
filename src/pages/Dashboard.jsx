import React, { useState, useEffect } from 'react';
import { getScheduledPosts } from '../services/api';
import PostCreator from '../components/PostCreator';
import Trends from '../components/Trends';
// import Analytics from '../components/Analytics';

const Dashboard = ({ user, onLogout }) => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const fetchPosts = async () => {
    if (user) {
      setLoadingPosts(true);
      try {
        const response = await getScheduledPosts();
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoadingPosts(false);
      }
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  if (!user) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold">Loading your dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl p-8 space-y-8">
      <header className="flex justify-between items-center bg-gray-800 p-6 rounded-xl shadow-md">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          <p className="text-gray-400">@{user.username}</p>
        </div>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full shadow-md transition-colors"
        >
          Logout
        </button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-2">
          {user && <PostCreator userId={user.xId} onPostCreated={fetchPosts} />}
        </section>

        <section className="md:col-span-1">
          {/* We now pass the fetchPosts function to the Trends component */}
          <Trends onPostCreated={fetchPosts} />
        </section>

        {/* <section className="md:col-span-2"> */}
          {/* <Analytics /> */}
        {/* </section> */}

        <section className="md:col-span-3">
          <div className="bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Scheduled Posts</h2>
            {loadingPosts ? (
              <p>Loading your scheduled posts...</p>
            ) : posts.length === 0 ? (
              <p className="text-gray-400">You don't have any scheduled posts yet.</p>
            ) : (
              <ul className="space-y-4">
                {posts.map((post) => (
                  <li key={post._id} className="bg-gray-700 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-300">{new Date(post.scheduledDate).toLocaleString()}</p>
                      <p className="mt-1">{post.text}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        post.status === 'sent' ? 'bg-green-500 text-white' :
                        post.status === 'failed' ? 'bg-red-500 text-white' :
                        'bg-yellow-500 text-black'
                      }`}
                    >
                      {post.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
