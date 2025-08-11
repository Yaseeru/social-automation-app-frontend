import React from 'react';

const Login = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-6">Welcome to X Automation</h1>
      <p className="text-gray-400 mb-8">Login with your X account to get started.</p>
      <a href="http://localhost:3001/auth/login" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-md transition-colors">
        Login with X
      </a>
    </div>
  );
};

export default Login;
