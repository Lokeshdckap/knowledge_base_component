import React, { useEffect, useState } from "react";
import logo from "../../../assets/images/onboard.png";
import { Link, useParams } from "react-router-dom";
import Input from "./Input";
import { useStateContext } from "../../../context/ContextProvider";
import axiosClient from "../../../axios-client";
import HashLoader from "react-spinners/HashLoader";

export default function SigninComponents() {
  const params = useParams();

  const [errors, setError] = useState({});

  const [PasswordVisible, setPasswordVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const { setAuth } = useStateContext();

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
    let passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!formValues.email.trim()) {
      validationErrors.email = "Email is required";
      isValid = false;
    }

    if (!formValues.password.trim()) {
      validationErrors.password = "Password is required";
      isValid = false;
    } else if (!passwordRegex.test(formValues.password)) {
      validationErrors.password = "Password is not valid";
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
        .post("http://localhost:4000/login", formValues)
        .then(({ data }) => {
          if (data.verify) {
            setAuth({
              token: data.token,
              verify: data.verify,
              state: true,
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
    <main className="flex">
      <div className="bg-primary w-1/2 h-screen">
        <img
          src={"https://i.postimg.cc/ydTtqjsF/book-2.png"}
          alt=""
          className="max-w-md ml-11 mt-6 h-6"
        />

        <p className="mx-6 text-white text-sm font-medium pt-2">Rhino Tome</p>
        <img
          src={logo}
          alt=""
          className="max-w-[390px]  m-auto mt-[70px] mb-[112px] "
        />
      </div>
      <div className="bg-secondary  w-1/2 p-32">
        <div>
          <h2 className="text-xl text-textPrimary">
            Happy To See You Back ! Our Rhino Tome{" "}
          </h2>
          <h3 className="pt-2 text-base text-textPrimary">
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
                placeholder="email"
              />
            </div>
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

                <div className="mt-0 flex items-center justify-between ">
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
          <div className="mt-28 ml-24">
            <button
              type="submit"
              className="bg-primary w-36 text-white h-11 rounded-md"
            >
              Signin
            </button>
          </div>
        </form>
        <div className="space-x-1 pt-4 ml-20 ">
          <span className="text-textPrimary">Create an account?</span>
          <Link to="/signup" className="text-primary">
            Signup
          </Link>
        </div>
        {loading && (
          <>
            <div className="bg-primary opacity-[0.5] w-[1289px] h-[664px] absolute top-0 left-0  z-10"></div>
            <p className="absolute top-72 left-[600px] z-40">
              <HashLoader color="#3197e8" />
            </p>
          </>
        )}
      </div>
    </main>
  );
}
