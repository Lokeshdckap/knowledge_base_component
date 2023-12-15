import React, { useState } from "react";
import forgotPassword from "../../../assets/images/forgotpassword.png";
import { Link } from "react-router-dom";
import axios from "axios";
import Input from "./Input";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosClient from "../../../axios-client";
import HashLoader from "react-spinners/HashLoader";

export default function ForgotPassword() {
  const [newItem, setNewItem] = useState("");
  const [errors, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const duration = 2000;

  const showToastMessage = (data) => {
    toast.success(data, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: duration,
      hideProgressBar: true,
      draggable: true,
      closeOnClick: true,
    });
  };

  const HandleChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
    delete errors[name];
  };

  const forgotHandle = (e) => {
    e.preventDefault();

    const validationErrors = {};

    if (!newItem.email) {
      validationErrors.email = "email is required";
    } else {
      setLoading(true);
      axiosClient
        .post("/api/auth/forgotPassword", newItem)
        .then((res) => {
          setLoading(false);

          showToastMessage(res.data);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response?.status === 400) {
            let error = {};
            error.email = response.data;

            setError(error);
            setLoading(false);
          } else {
            console.error("Error:", response?.status);
          }
        });
    }
    setError(validationErrors);
  };

  return (
    <main className="flex h-[100vh] max-w-[100%]">
      <div className="m-auto px-[40px]">
        <div className="">
          <h1 className="text-3xl phone:text-[24px] text-primary font-bold">
            Forgot Your Password?
          </h1>
          <h2 className="text-base phone:text-[14px] text-textPrimary max-w-[390px] w-[100%] pt-2">
            To reset your password please enter the email address of your Pen it
            account
          </h2>
        </div>
        <form onSubmit={forgotHandle}>
          <div className="pt-5">
            <label className="text-textPrimary text-base">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="pt-3 ">
              <Input
                name="email"
                type="text"
                event={HandleChange}
                value={newItem.email}
                placeholder="email"
              />

              <div className="mt-1 flex items-center justify-between ">
                {!errors.email ? (
                  <div>
                    <p className="invisible">Required</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-red-500">{errors.email}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="pt-5">
            <button
              type="submit"
              className="bg-primary text-white h-11 rounded-md w-96 phone:w-[296px] text-base"
              name="email"
            >
              Reset Password Link
            </button>
          </div>
        </form>
        <div className="pt-5 flex justify-center  underline text-primary">
          <Link to="/signin">Go to Signin</Link>
        </div>
      </div>
      <div
        className=" phone:hidden md:hidden   lg:bg-primary lg:block xl:block 2xl:block
        h-[100vh] w-[50%]
        "
      >
        <div className="  h-[100vh] m-auto flex justify-center items-center ">
          <img src={forgotPassword} alt="" className="max-w-[390px]" />
        </div>
      </div>
      <ToastContainer />
      {loading && (
        <>
          <div className="bg-[#aeaeca] opacity-[0.5] w-[100%] h-[100vh] absolute top-0 left-0  z-10"></div>
          <div className="">
            <p className="absolute top-[48%] left-[48%] z-50 ">
              <HashLoader color="#3197e8" />
            </p>
          </div>
        </>
      )}
    </main>
  );
}
