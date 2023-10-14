import React, { useState } from 'react'
import changePassword from '../../../assets/images/Changepassword.png';
import { Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import Input from '../../../common/commonComponents/Input';
import axiosClient from '../../../axios-client';
import { ToastContainer, toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";




export default function ChangePassword() {


  const [newPassword, setNewPassword] = useState("");
  const [errors, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  const params = useParams()
  const navigate = useNavigate();
  const [PasswordVisible, setPasswordVisible] = useState(false);
  const [ConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);




  function togglePassword() {
    setPasswordVisible((prevState) => !prevState);
  }

  function togglePassword() {
    setPasswordVisible((prevState) => !prevState);
  }

  const showToastMessage = (data) => {
    toast.success(data, {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const warnToastMessage = (data) => {
    toast.warning(data, {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const HandleChange = (e) => {

    const { name, value } = e.target;
    setNewPassword({ ...newPassword, [name]: value });
    delete errors[name];

  };

  const resetPassword = (e) => {
    e.preventDefault();

    const validationErrors = {}

    if (!newPassword.password) {
      validationErrors.password = "password is required"
    }
    if (!newPassword.confirmPassword) {
      validationErrors.confirmPassword = "confirmPassword is required"
    }
    if (newPassword.password !== newPassword.confirmPassword) {
      validationErrors.confirmPassword = "Password not match"
    }

    setError(validationErrors)
    
    if (Object.keys(validationErrors).length === 0) {
        setLoading(true)

      axiosClient.post(`http://localhost:4000/resetPassword/${params.uuid}/${params.token}`, newPassword)

        .then(({ data }) => {
          setLoading(false)
          showToastMessage(data.message);
          setTimeout(() => {
            navigate('/signin'); // Navigate to "/signin" on success

          }, 5000);

        })
        .catch(err => {

          const response = err.response;
          if (response && response.status === 400) {
            setLoading(false)
            console.log(response.data.message);
            warnToastMessage(response.data.message);
           
          }
          else {
            console.error('Error:', response.status);
          }
        })
    }

  };

  return (
    <main className="flex">
      <div className='bg-secondary h-[664px] w-1/2 p-20' >
        <div className='space-y-2'>
          <h1 className='text-3xl text-primary font-bold'>Change Your Passwords?</h1>
          <h2 className='text-base text-textPrimary'>To reset your password please enter the email address
            of your Pen it account</h2>
        </div>
        <form className="space-y-2 pt-3" action="#" method="POST">  
          <div className='relative'>
            <label htmlFor="password" className="text-textPrimary text-base	">New Password <span className='text-red-500'>*</span></label>
            <div className="mt-1">
              <Input name="password" type={PasswordVisible ? "text" : "password"} event={HandleChange} value={newPassword.password} placeholder="password" />
              <div className=''>
                {PasswordVisible ? (
                  <span className="material-symbols-outlined absolute right-28 top-10 cursor-pointer text-gray-500 text-xl" onClick={togglePassword}> visibility
                  </span>
                ) : (
                  <span className="material-symbols-outlined absolute right-28 top-10 cursor-pointer text-gray-500 text-xl" onClick={togglePassword}> visibility_off
                  </span>
                )
                }
                <div className='mt-0 flex items-center justify-between '>
                  {!errors.password ? <div><p className='invisible'>Required</p></div> :
                    <div ><p className='text-red-500'>{errors.password}</p></div>}
                </div>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="text-textPrimary text-base	">Confirm New Password <span className='text-red-500'>*</span></label>
            <div className="mt-2 relative">
              <Input name="confirmPassword" type={ConfirmPasswordVisible ? "text" : "password"} event={HandleChange} value={newPassword.confirmPassword} placeholder="confirmPassword" />
              <div className=''>
                {ConfirmPasswordVisible ? (
                  <span className="material-symbols-outlined absolute right-28 top-2 cursor-pointer text-gray-500 text-xl" onClick={setConfirmPasswordVisible}> visibility
                  </span>
                ) : (
                  <span className="material-symbols-outlined absolute right-28 top-2 cursor-pointer text-gray-500 text-xl" onClick={setConfirmPasswordVisible}> visibility_off
                  </span>
                )
                }
                <div className='mt-0 flex items-center justify-between '>
                  {!errors.confirmPassword ? <div><p className='invisible'>Required</p></div> :
                    <div ><p className='text-red-500'>{errors.confirmPassword}</p></div>}
                </div>
              </div>
            </div>
          </div>

          <div className='pt-2'>
            <Link to="/changepassword"><button type="submit" className="bg-primary text-white h-11 rounded-md w-96 text-base" onClick={resetPassword}>Reset My Password</button></Link>
          </div>
          <div className='pt-5 pl-32 underline text-primary'>
            <Link to="/signin">Go to Signin</Link>
          </div>
        </form>
      </div>
      <div className='bg-primary w-1/2 h-[664px]'>
        <img src={changePassword} alt="" className='p-16' />
      </div>
      <ToastContainer />
      {loading && <p className="absolute top-72 left-[622px]">
        <HashLoader color="#3197e8" /></p>}


    </main>
  )
}