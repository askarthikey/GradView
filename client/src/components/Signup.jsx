import React from 'react';
import { SignUp } from '@clerk/clerk-react';

function Signup() {
  return (
    <div className="text-gray-900 bg-gray-50 min-h-screen flex flex-col items-center px-6 py-6">
      {/* Header Section */}
      <div className="text-center mb-8 max-w-md">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-3">
          Join GradView
        </h1>
        <p className="text-lg text-gray-600">
          Create your account to start connecting, tracking, and succeeding on your academic journey.
        </p>
      </div>
      <div className="w-full max-w-md">
        <div className="relative">
          {/* Actual SignUp Container */}
          <div className="relative">
            <SignUp />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;