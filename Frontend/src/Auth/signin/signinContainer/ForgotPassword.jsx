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

  const showToastMessage = (data) => {
    toast.success(data, {
      position: toast.POSITION.TOP_CENTER,
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
      setLoading(true)
      axiosClient.post("http://localhost:4000/forgotPassword", newItem)
        .then((res) => {
          setLoading(false)

          showToastMessage(res.data);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 400) {
            console.log(response);
            let error = {};
            error.email = response.data;

            setError(error);
          setLoading(false)


          } else {
            console.error("Error:", response.status);
          }
        });
    }
    setError(validationErrors);
  };

  return (
    <main className="flex">
      <div className="bg-secondary h-[664px] w-1/2 pt-44 pl-32">
        <div className="space-y-2">
          <h1 className="text-3xl text-primary font-bold">
            Forgot Your Password?
          </h1>
          <h2 className="text-base text-textPrimary w-96">
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

              <div className="mt-0 flex items-center justify-between ">
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
              className="bg-primary text-white h-11 rounded-md w-96 text-base"
              name="email"
            >
              Reset Password Link
            </button>
          </div>
        </form>
        <div className="pt-5 pl-32 underline text-primary">
          <Link to="/signin">Go to Signin</Link>
        </div>
      </div>
      <div className="bg-primary w-1/2 h-[664px]">
        <img src={forgotPassword} alt="" className="p-16" />
      </div>
      <ToastContainer />
      {loading && <p className="absolute top-72 left-[622px]">
        <HashLoader color="#3197e8" /></p>}
    </main>
  );
}
