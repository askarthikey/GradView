import React from 'react';
import { SignIn } from '@clerk/clerk-react';

function Signin() {
  // console.log("Hello")
  return (
    <div className="text-gray-900 bg-gray-50 min-h-screen flex flex-col items-center my-10  px-6 py-6">
      {/* Header Section */}
      <div className="text-center mb-8 max-w-md">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-3">
          Welcome Back
        </h1>
        <p className="text-lg text-gray-600">
          Sign in to continue your academic journey with GradView.
        </p>
      </div>
      
      <div className="w-full max-w-md">
        <div className="relative">
          {/* Actual SignIn Container */}
          <div className="relative">
            <SignIn />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signin;