import React from 'react';
import { createBrowserRouter,RouterProvider , Routes, Route } from 'react-router-dom';
import { Router } from 'react-router-dom';
import RootLayout from './components/RootLayout';
import { Navigate } from 'react-router-dom';
import StartPage from './components/StartPage';
import Signup from './components/Signup';
import Signin from './components/Signin';
import Connect from './components/Connect';
import ProjectsPatentsPublications from './components/ScholarlyWork';
import Coding from './components/Coding';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import { StudentProvider } from './contexts/StudentContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <StartPage />,
      },
      {
        path: '/home',
        element: <Home />,
      },
      {
        path: '/sign-up',
        element: <Signup />,
      },
      {
        path: '/sign-in',
        element: <Signin />,
      },
      {
        path: '/dash',
        element: <Dashboard />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/connect',
        element: <Connect />,
      },
      // Routes for scholarly work with dynamic tab
      {
        path: '/schwk/:tab', // This is for dynamic tabs like /schwk/projects, /schwk/patents, /schwk/publications
        element: <ProjectsPatentsPublications />,
      },
      // Redirect /schwk to /schwk/projects by default
      {
        path: '/schwk',
        element: <Navigate to="/schwk/projects" replace />,
      },
      /*{
        path: '/code',
        element: <Coding />,
      },*/
    ],
  },
]);

function App() {
  return (
    <StudentProvider>
      <RouterProvider router={router} />
    </StudentProvider>
  )
}

export default App;