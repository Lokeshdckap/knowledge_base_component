import React from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import SigninContainer from "./Auth/signin/signinContainer/SigninContainer";
import SignupContainer from "./Auth/signup/signupContainer/SignupContainer";
import ForgotPassword from "./Auth/signin/signinContainer/ForgotPassword";
import ChangePassword from "./Auth/signin/signinContainer/ChangePassword";
import EmailVerification from "./Auth/signup/signupContainer/EmailVerification";
import Error from "./Error/Error";
import DefaultLayout from "./components/DefaultLayout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import Dashboard from "./Dashboard/container/Dashboard";
import TeamPage from "./Dashboard/components/TeamPage";
import { Batch } from "./Batch/container/Batch";


const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" />
      },
      {
        path: "/dashboard/:uuid",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/:uuid/b",
        element: <Batch />,
      },
      {
        path: "/dashboard/:uuid/s",
        element: <Dashboard />,
      },
      {
        path: "/teampage",
        element: <TeamPage />,
      },
    ],

  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        path: "/signin",
        element: <SigninContainer />,
      },
      {
        path: "/signup",
        element: <SignupContainer />,
      },
      {
        path: "/forgotpassword",
        element: <ForgotPassword />,
      },
      {
        path: "/changepassword/:uuid/:token",
        element: <ChangePassword />,
      },
      {
        path: "/emailverify",
        element: <EmailVerification />,
      },
      {
        path: "/email-verify/:uuid/:token",
        element: <SignupContainer />,
      },
    ],
  },

  {
    path: "*",
    element: <Error />,
  },
]);

export default router;
