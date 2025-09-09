import React from 'react'
import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div
      style={{
        height: '100vh',
        minHeight: '80vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        backgroundColor: '#CE9458'
      }}
    >
      <SignIn routing="path" path="/sign-in" />
    </div>
  )
}


