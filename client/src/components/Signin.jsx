import React from 'react'
import { SignIn } from '@clerk/clerk-react'

function Signin() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <SignIn />
    </div>
  )
}

export default Signin