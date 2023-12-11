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
import { Scripts } from "./Scripts/container/Scripts";
import { UrlPage } from "./common/commonLayouts/UrlPage";
import { Invited } from "./Invited.jsx";
import { Dashboards } from "./Dashboard/container/Dashboards.jsx";
import { JoinTeam } from "./joinTeam/JoinTeam.jsx";
import { Trash } from "./Trash/container/Trash.jsx";
import TeamLayout from "./components/TeamLayout.jsx";
import { TeamSetting } from "./Team/components/TeamSetting.jsx";
import { Profile } from "./Team/components/Profile.jsx";
import { BlankLayout } from "./components/BlankLayout.jsx";
import { ActiveUsers } from "./Team/components/ActiveUsers.jsx";
import { ScriptEditor } from "./Scripts/components/ScriptEditor.jsx";
import { EmailVerificationCheck } from "./Auth/signup/signupContainer/EmailVerificationCheck";
import GoogleCallback from "./Auth/signup/signupComponents/GoogleCallback";

const router = createBrowserRouter([
  {
    path: "/setting",
    element: <TeamLayout />,
    children: [
      {
        path: ":uuid/teamsetting",
        element: <TeamSetting />,
      },
      {
        path: ":uuid/profile",
        element: <Profile />,
      },
      {
        path: ":uuid/activeusers",
        element: <ActiveUsers />,
      },
    ],
  },
  
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to={`/dashboard`} />,
      },
      {
        path: "/dashboard",
        element: <Dashboards />,
      },
      {
        path: "/dashboard/:uuid",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/:uuid/b/:slug",
        element: <Batch />,
      },
      {
        path: "/dashboard/:uuid/s/:slug/:pageId?",
        element: <Scripts />,
      },
      {
        path: "/dashboard/:uuid/changes/:slug/:pageId?",
        element: <ScriptEditor />,
      },
      {
        path: "/dashboard/:uuid/changes/:slug",
        element: <ScriptEditor />,
      },
      {
        path: "/dashboard/:uuid/s/:slug",
        element: <Scripts />,
      },

      {
        path: "/share",
        element: <TeamPage />,
      },
      {
        path: "/signin/:uuid/:id",
        element: <Invited />,
      },
      {
        path: "/dashboard/:uuid/t/:slug",
        element: <Trash />,
      },
    ],
  },

  {
    path: "/teampage",
    element: <BlankLayout />,
    children: [
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
        element: <EmailVerificationCheck />,
      },
      {
        path: "/auth/google",
        element: <GoogleCallback />,
      },
      // {
      //   path: "/email-verify/:uuid/:token",
      //   element: <SignupContainer />,
      // },
    ],
  },

  {
    path: "/join/:token",
    element: <JoinTeam />,
  },
  {
    path: "/error",
    element: <Error />,
  },
  {
    path: "/:uuid/:slug/*",
    element: <UrlPage />,
  },
  {
    path: "/teampage",
    element: <TeamPage />,
  },
]);

export default router;
