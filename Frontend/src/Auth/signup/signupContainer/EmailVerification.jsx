import React from "react";
import emailverify from "../../../assets/images/emailverify.png";

export default function EmailVerification() {
  const resend = (value) => {
    console.log(value);
  };
  return (
     <div>
      <div className='bg-primary w-screen h-64 absolute'>

      </div>
      <div className='bg-white mt-10 ml-[350px] shadow-2xl rounded w-[600px] h-[550px] absolute '>
        <h1 className='text-primary text-center text-lg font-semibold pt-10'>Verify your Email Address</h1>
        <img src={emailverify} alt="" className='h-[350px] w-96 m-auto' />
        <h2 className='w-[350px] m-auto text-textPrimary'> Before proceeding Our Knowledge Base, please check your email for a verification</h2>
        <div className='text-center pt-5'>
          <button type="submit" className="bg-primary  w-36 text-white h-11 rounded-md ">Resend Link</button>
        </div>
      </div>
      <div className='bg-secondary w-screen h-64'>

      </div>

    </div>

  );
}
