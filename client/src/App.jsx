import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './components/RootLayout';
import StartPage from './components/StartPage'
import Signup from './components/Signup';
import Connect from './components/Connect';
import { SignIn } from '@clerk/clerk-react';
import ProjectsPatentsPublications from './components/ProjectsPatentsPublications';
import Coding from './components/Coding';

function App() {
  const router=createBrowserRouter([
    {
      path:'/',
      element:<RootLayout/>,
      children:[
        {
          path:'/',
          element:<StartPage/>
        },
        {
          path:'/sign-up',
          element:<Signup/>
        },
        {
          path:'/sign-in',
          element:<SignIn/>
        },
        {
          path:'/connect',
          element:<Connect/>
        },
        {
          path:'/ppp',
          element:<ProjectsPatentsPublications/>
        },
        {
          path:'/code',
          element:<Coding/>
        }
      ]
    }
  ])
  return (
    <RouterProvider router={router}/>
  )
}

export default App
