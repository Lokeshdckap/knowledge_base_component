import React from "react";
import emailverify from "../../../assets/images/emailverify.png";
import axiosClient from "../../../axios-client";
import Cookies from 'js-cookie';
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
export default function EmailVerification() {

  const userEmail = Cookies.get('userEmail');

  let duration = 2000
  const showToastMessage = (data) => {
    toast.success(data, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: duration,
      hideProgressBar: true,
      draggable: true,
      closeOnClick: true,
    });
  };
  const resendLink = () => {
    axiosClient.post("/api/auth/resendVerifyEmail",{"email":userEmail})
    .then(({ data }) => {
      showToastMessage(data);
    })
  };
  return (
     <div>
      <div className='bg-primary w-screen h-64 absolute'>

      </div>
      <div className='bg-white ml-[350px] mt-8 shadow-2xl rounded w-[600px] h-[550px] absolute '>
        <p className='text-primary text-center text-lg font-semibold pt-10'>Verify your Email Address</p>
        <img src={emailverify} alt="" className='h-[350px] w-96 m-auto' />
        <p className='w-[350px] m-auto text-textPrimary'> Before proceeding Our Knowledge Base, please check your email for a verification</p>
        <div className='text-center pt-5'>
          <button type="submit" className="bg-primary  w-36 text-white h-11 rounded-md " onClick={resendLink}>Resend Link</button>
          <Link to="/signin"><button type="submit" className="bg-primary  w-36 text-white h-11 rounded-md ml-2">Please Login</button></Link>

        </div>
      </div>
      <div className='bg-secondary w-screen h-64'>

      </div>
      <ToastContainer />
    </div>

  );
}
