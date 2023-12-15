import React, { useEffect, useState } from "react";
import logo from "../../../assets/images/onboard.png";
import { Link, useParams } from "react-router-dom";
import Input from "./Input";
import { useStateContext } from "../../../context/ContextProvider";
import axiosClient from "../../../axios-client";
import HashLoader from "react-spinners/HashLoader";
import googles from "../../../assets/images/google.png";

export default function SigninComponents() {
  const params = useParams();

  const [errors, setError] = useState({});

  const [PasswordVisible, setPasswordVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const { auth, setAuth } = useStateContext();

  function togglePassword() {
    setPasswordVisible((prevState) => !prevState);
  }

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const HandleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    delete errors[name];
  };

  const validation = () => {
    let isValid = true;
    let validationErrors = {};

    if (!formValues.email.trim()) {
      validationErrors.email = "Email is required";
      isValid = false;
    }

    if (!formValues.password.trim()) {
      validationErrors.password = "Password is required";
      isValid = false;
    }
    setError(validationErrors);

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (validation()) {
      setLoading(true);
      axiosClient
        .post("/api/auth/login", formValues)
        .then(({ data }) => {
          console.log(data);
          if (data.verify) {
            setAuth({
              token: data.access_token,
              refresh_token: data.refresh_token,
              verify: data.verify,
            });
          } else {
            {
              setError({
                email: "Please verifiy your email",
              });
            }
          }

          setLoading(false);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response?.status === 401) {
            let error = {};
            let keys = Object.keys(response.data);
            let value = Object.values(response.data);

            error[keys] = value;
            setLoading(false);

            setError(error);
          } else {
            console.error("Error:", response?.status);
          }
        });
    }
  };

  return (
    <main className="flex h-[100vh] max-w-[100%]">
      <div
        className=" phone:hidden md:hidden   lg:bg-primary lg:block xl:block 2xl:block
        h-[100vh] w-[50%]
        "
      >
        <div>
          <div className="pt-[20px] pl-[20px]">
            <img
              src={"https://i.postimg.cc/ydTtqjsF/book-2.png"}
              alt=""
              className="w-6"
            />
            <p className=" text-white text-sm font-medium pt-2">Rhino Tome</p>
          </div>
          <div className="  h-[80vh] m-auto flex justify-center items-center ">
            <img src={logo} alt="" className=" max-w-[390px]" />
          </div>
        </div>
      </div>
      <div className="m-auto  ">
        <div className=" w-[100%] ">
          <div>
            <h2 className="text-xl phone:text-[16px] text-textPrimary">
              Happy To See You Back ! Our Rhino Tome{" "}
            </h2>
            <h3 className="pt-2 text-base phone:text-[14px] text-textPrimary">
              Log in and unlock your world!
            </h3>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="pt-5">
              <label className="text-textPrimary text-base">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="pt-3 ">
                <Input
                  name="email"
                  type="text"
                  event={HandleChange}
                  value={formValues.email}
                  placeholder="Email"
                />
              </div>
              {!errors.email ? (
                <div>
                  <p className="invisible mt-1">Required</p>
                </div>
              ) : (
                <div>
                  <p className="text-red-500 mt-1">{errors.email}</p>
                </div>
              )}
            </div>
            <div className="pt-1">
              <label className="text-textPrimary text-base">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="pt-3 absolute">
                <Input
                  name="password"
                  type={PasswordVisible ? "text" : "password"}
                  event={HandleChange}
                  value={formValues.password}
                  placeholder="Password"
                />
                <div className="">
                  {PasswordVisible ? (
                    <span
                      className="material-symbols-outlined absolute right-3 top-5 cursor-pointer text-gray-500 text-xl"
                      onClick={togglePassword}
                    >
                      {" "}
                      visibility
                    </span>
                  ) : (
                    <span
                      className="material-symbols-outlined absolute right-3 top-5 cursor-pointer text-gray-500 text-xl"
                      onClick={togglePassword}
                    >
                      {" "}
                      visibility_off
                    </span>
                  )}

                  <div className="mt-1 flex items-center justify-between ">
                    {!errors.password ? (
                      <div>
                        <p className="invisible">Required</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-red-500">{errors.password}</p>
                      </div>
                    )}

                    <Link to="/forgotpassword">
                      <p className="text-primary text-sm  pt-2">
                        Forgot Password
                      </p>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-28 flex justify-center">
              <button
                type="submit"
                className="bg-primary w-36 text-white h-11 rounded-md"
              >
                Signin
              </button>
            </div>
          </form>
          <div className="space-x-1 pt-4 flex justify-center ">
            <span className="text-textPrimary">Create an account?</span>
            <Link to="/signup" className="text-primary">
              Signup
            </Link>
          </div>
          <div className="flex justify-center">
            <div className="bg-white w-10 h-10 ">
              <img src={googles} className="p-2" />
            </div>

            <button className="bg-white w-40 h-10 text-primary rounded font-medium text-sm backdrop-blur-[2px] border-[1px]">
              <a href="http://localhost:4000/api/auth/google">
                Continue With Google
              </a>
            </button>
          </div>
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
        </div>
      </div>
    </main>
  );
}
