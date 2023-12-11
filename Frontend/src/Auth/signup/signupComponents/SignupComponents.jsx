import React, { useEffect, useState } from "react";
import Button from "../../../common/commonComponents/Button";
import Input from "../../../common/commonComponents/Input";
import googles from "../../../assets/images/google.png";
import logo from "../../../assets/images/onboard.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../../../context/ContextProvider";
import axiosClient from "../../../axios-client";
import HashLoader from "react-spinners/HashLoader";
import Cookies from "js-cookie";

export default function SignupComponents() {
  const googleAuth = () => {
    window.open(
      `http://localhost:4000/api/auth/auth/google/callback`,
      "_self"
    );
	};

  const [errors, setError] = useState({});
  const params = useParams();
  const navigate = useNavigate();

  const { setAuth } = useStateContext();

  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [PasswordVisible, setPasswordVisible] = useState(false);
  const [ConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  function togglePassword() {
    setPasswordVisible((prevState) => !prevState);
  }

  function toggleConfirmPassword() {
    setConfirmPasswordVisible((prevState) => !prevState);
  }

  const handleSumbit = (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!formValues.username.trim()) {
      validationErrors.username = "username is required";
    }
    if (!formValues.email.trim()) {
      validationErrors.email = "email is required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(
        formValues.email
      )
    ) {
      validationErrors.email = "email is not valid";
    }

    if (!formValues.password.trim()) {
      validationErrors.password = "password is required";
    }
    if (!formValues.confirmPassword.trim()) {
      validationErrors.confirmPassword = "confirmPassword is required";
    }
    if (formValues.password !== formValues.confirmPassword) {
      validationErrors.confirmPassword = "Password not match";
    }

    setError(validationErrors);

    // setLoading(false)

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);

      Cookies.set("userEmail", formValues.email, { expires: 7 });
      axiosClient
        .post("/api/auth/register", formValues)
        .then(({ data }) => {
          setAuth({
            token: data.access_token,
          });
          setLoading(false);
          navigate("/emailverify");
        })
        .catch((err) => {
          // debugger;
          const response = err.response;
          if (response && response?.status === 409) {
            let error = {};
            let keys = Object.keys(response.data);
            let value = Object.values(response.data);

            error[keys] = value;

            setError(error);
            setLoading(false);
          } else {
            console.error("Error:", response?.status);
          }
        });
    }
  };

  const HandleChange = (e) => {
    const { name, value } = e.target;

    let inviteDetail = JSON.parse(localStorage.getItem("inviteInfo"));
    if (inviteDetail) {
      setFormValues({
        ...formValues,
        [name]: value,
        team_uuid: inviteDetail.team_uuid,
        role: inviteDetail.role,
      });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
    delete errors[name];
  };


  return (
    <div className="">
      <div className="flex ">
        <div className="bg-primary w-1/2 h-screen">
          <img
            src={"https://i.postimg.cc/ydTtqjsF/book-2.png"}
            alt=""
            className="max-w-md ml-11 mt-6 h-6"
          />

          <p className="mx-6 text-white text-sm font-medium pt-2">Rhino Tome</p>
          <img
            src={logo}
            className="max-w-[390px]  m-auto mt-[70px] mb-[112px] "
          />
        </div>
        <div className="bg-secondary w-1/2 h-screen">
          <div className=" ml-[140px]  mt-[25px] space-y-1">
            <h2 className="text-textPrimary font-bold text-2xl">
              Welcome to DCKAP Rhino Tome! 👋
            </h2>
            <h3 className="text-textPrimary font-medium">
              Please Sign Into Your Account
            </h3>
            <form className="space-y-1" onSubmit={handleSumbit}>
              <div>
                <label className="text-textPrimary text-base pt-2">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="">
                  <Input
                    name="username"
                    type="username"
                    event={HandleChange}
                    value={formValues.username}
                    placeholder="Username"
                  />
                </div>
                {!errors.username ? (
                  <span className="text-base invisible">Required</span>
                ) : (
                  <span className="text-red-500">{errors.username}</span>
                )}
              </div>
              <div>
                <label className="text-textPrimary text-base">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="">
                  <Input
                    name="email"
                    type="email"
                    event={HandleChange}
                    value={formValues.email}
                    placeholder="Email"
                  />
                </div>
                {!errors.email ? (
                  <span className="text-base invisible">Required</span>
                ) : (
                  <span className="text-red-500">{errors.email}</span>
                )}
              </div>
              <div className="">
                <label className="text-textPrimary text-base">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="pt-1 absolute">
                  <input
                    type={PasswordVisible ? "text" : "password"}
                    onChange={HandleChange}
                    value={formValues.password}
                    className="w-96 h-9 mt-1 rounded-sm border-slate-900 p-2 text-sm outline-none outline-gray-200"
                    placeholder="Password"
                    name="password"
                    onPaste={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                    onCopy={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                  />
                  {PasswordVisible ? (
                    <span
                      className="material-symbols-outlined absolute right-3 top-3 cursor-pointer text-gray-500 text-xl"
                      onClick={togglePassword}
                    >
                      {" "}
                      visibility
                    </span>
                  ) : (
                    <span
                      className="material-symbols-outlined absolute right-3 top-3 cursor-pointer text-gray-500 text-xl"
                      onClick={togglePassword}
                    >
                      {" "}
                      visibility_off
                    </span>
                  )}
                </div>
                <div className="mt-10 f ">
                  {!errors.password ? (
                    <div>
                      <p className="invisible">Required</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-red-500">{errors.password}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-1">
                <label className="text-textPrimary text-base">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="pt-1 absolute">
                  <input
                    type={ConfirmPasswordVisible ? "text" : "password"}
                    value={formValues.confirmPassword}
                    onChange={HandleChange}
                    className="w-96 h-9 mt-1 rounded-sm border-slate-900 p-2 text-sm outline-none outline-gray-200"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    onPaste={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                    onCopy={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                  />
                  {ConfirmPasswordVisible ? (
                    <span
                      className="material-symbols-outlined absolute right-3 top-3 cursor-pointer text-gray-500 text-xl"
                      onClick={toggleConfirmPassword}
                    >
                      visibility
                    </span>
                  ) : (
                    <span
                      className="material-symbols-outlined absolute right-3 top-3 cursor-pointer text-gray-500 text-xl"
                      onClick={toggleConfirmPassword}
                    >
                      visibility_off
                    </span>
                  )}
                </div>
                <div className="mt-11 flex items-center justify-between ">
                  {!errors.confirmPassword ? (
                    <div>
                      <p className="invisible">Required</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-red-500">{errors.confirmPassword}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="">
                <Button name="Signup" />
              </div>
            </form>
            <div className="space-x-1 mt-5 ml-12">
              <span className="text-textPrimary ">
                Already have an account?
              </span>
              <Link to="/Signin" className="text-primary ">
                Signin Here
              </Link>
            </div>
            <div className="flex ml-16">
              <div className="bg-white w-10 h-10 ">
                <img src={googles} className="p-2" />
              </div>

              <button onClick={googleAuth}
                className="bg-white w-40 h-10 text-primary rounded backdrop-blur-[2px] border-[1px]"
                // onClick={google}
              >

                  Signup With Google

              </button>
            </div>
          </div>
        </div>
      </div>
      {loading && (
        <>
          <div className="bg-primary opacity-[0.5] w-screen h-[664px] absolute top-0 left-0  z-10"></div>
          <p className="absolute top-72 left-[600px] z-40">
            <HashLoader color="#3197e8" />
          </p>
        </>
      )}
    </div>
  );
}
