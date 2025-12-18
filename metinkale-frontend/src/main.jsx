// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// import App from './App.jsx';
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom';
import FeedbackDetail from './pages/feedback/FeedbackDetail';
import FietsList from './components/fiets/FietsList.jsx';
import NotFound from './pages/NotFound';
import Home from './pages/HomePage';
import About from './pages/about/About.jsx';
import Layout from './pages/Layout';
import FietsDetail from './pages/fiets/FietsDetail';
import FietsUpdate from './pages/fiets/FietsUpdate.jsx';
import FeedbackList from './components/feedback/FeedbackList.jsx';
import LocatieList from './components/locatie/LocatieList.jsx';
import LocatieDetail from './pages/locatie/LocatieDetail.jsx';
import AddFeedback from './pages/feedback/AddFeedback.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import Register from './pages/Register.jsx';
import { AuthProvider } from './contexts/Auth.context.jsx';
import AddLocatie from './pages/locatie/AddLocatie.jsx';
import AddFiets from './pages/fiets/AddFiets.jsx';
import { ThemeProvider } from './contexts/Theme.context.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import VerhuurList from './components/verhuur/VerhuurList.jsx';
import AddVerhuur from './pages/verhuur/AddVerhuur.jsx';
import VerhuurDetail from './pages/verhuur/VerhuurDetail.jsx';
import Profile from './components/Profile.jsx';
import HuurFiets from './pages/verhuur/HuurFiets.jsx';
import Forbidden from './pages/Forbidden.jsx';
import './index.css';
// // 👇
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <Navigate replace to='/home' /> },
      { path: 'home', element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'login', element: <Login /> },
      { path: 'logout', element: <Logout /> },
      { path: 'register', element: <Register /> },
      {
        path: 'feedback',
        element: <PrivateRoute />,
        children: [
          { index: true, element: <FeedbackList /> },
          { path: 'addFeedback', element: <AddFeedback /> },
          { path: ':id', element: <FeedbackDetail /> },
        ],
      },
      {
        path: 'locaties',
        element: <PrivateRoute />,
        children: [
          { index: true, element: <LocatieList /> },
          { path: 'addLocatie', element: <AddLocatie /> },
          { path: ':id', element: <LocatieDetail /> },
        ],
      },
      {
        path: 'fietsen',
        element: <PrivateRoute />,
        children: [
          { index: true, element: <FietsList /> },
          { path: 'addFiets', element: <AddFiets /> },
          { path: ':id', element: <FietsDetail /> },
          { path: 'update/:fietsID', element: <FietsUpdate /> },
        ],
      },
      {
        path: 'verhuur',
        element: <PrivateRoute />,
        children: [
          { index: true, element: <VerhuurList /> },
          { path: 'addVerhuur', element: <AddVerhuur /> },
          { path: 'huur/:id', element: <HuurFiets /> },
          { path: ':verhuurID', element: <VerhuurDetail /> },
        ],
      },
      { path: 'profile', element: <Profile /> },
      { path: 'forbidden', element: <Forbidden /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <RouterProvider router={router} />
//   </StrictMode>,
// );

// Define the router with layout and nested routes
// const router = createBrowserRouter([
//   {
//     element: <Layout />, // Layout component as the main wrapper
//     children: [
//       {
//         path: '/',
//         element: <Navigate replace to='/home' />,
//       },
//       {
//         path: 'home',
//         element: <Home />,
//       },
//       {
//         path: 'about',
//         element: <About />, // Base About page
//       },
//       {
//         path: 'login',
//         element: <Login />,
//       },
//       {
//         path: 'feedback',
//         element: <PrivateRoute />,
//         children: [
//           {
//             index: true,
//             element: <FeedbackList />,
//           },
//           {
//             path: 'addFeedback',
//             element: <AddFeedback />,
//           },
//           {
//             path: ':id',
//             element: <FeedbackDetail />,
//           },
//         ],
//       },
//       {
//         path: 'locaties',
//         element: <PrivateRoute />,
//         children: [
//           {
//             index: true,
//             element: <LocatieList />,
//           },
//           {
//             path: 'addLocatie',
//             element: <AddLocatie />,
//           },
//           {
//             path: ':id',
//             element: <LocatieDetail />,
//           },
//         ],
//       },
//       {
//         path: 'fietsen',
//         element: <PrivateRoute />,
//         children: [
//           {
//             index: true,
//             element: <FietsList />,
//           },
//           {
//             path: 'addFiets',
//             element: <AddFiets />,
//           },
//           {
//             path: ':id',
//             element: <FietsDetail />,
//           },
//         ],
//       },

//       // {
//       //   path: '/verhuur',
//       //   element: <VerhuurList />,
//       // },
//       {
//         path: 'verhuur',
//         element: <PrivateRoute />,
//         children: [
//           {
//             index: true,
//             element: <VerhuurList />,
//           },
          
//         ],
//       },
//       {
//         path: 'addFeedback',
//         element: <AddFeedback />,
//       },
//       {
//         path: 'addLocatie',
//         element: <AddLocatie />,
//       },
//       {
//         path: 'addFiets',
//         element: <AddFiets />,
//       },
//       {
//         path: '/register',
//         element: <Register />,
//       },
//       {
//         path: '/logout',
//         element: <Logout />,
//       },
//       {
//         path: '*',
//         element: <NotFound />, // 404 page for undefined routes
//       },
//     ],
//   },
// ]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
