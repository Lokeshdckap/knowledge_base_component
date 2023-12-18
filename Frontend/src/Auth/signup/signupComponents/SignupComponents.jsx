import React, { useEffect, useState } from "react";
import Button from "../../../common/commonComponents/Button";
import Input from "../../../common/commonComponents/Input";
import googles from "../../../assets/images/google.png";
import logo from "../../../assets/images/onboard.png";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../../../context/ContextProvider";
import axiosClient from "../../../axios-client";
import HashLoader from "react-spinners/HashLoader";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";

export default function SignupComponents() {


  const [errors, setError] = useState({});
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();

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

    let passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,}$/;

    if (!formValues.username.trim()) {
      validationErrors.username = "Username is required";
    }
    if (!formValues.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/.test(
        formValues.email
      )
    ) {
      validationErrors.email = "Email is not valid";
    }

    if (!formValues.password.trim()) {
      validationErrors.password = "Password is required";
    } else if (formValues.password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(formValues.password)) {
      validationErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(formValues.password)) {
      validationErrors.password =
        "Password must contain at least one special character";
    } else if (!passwordRegex.test(formValues.password)) {
      validationErrors.password = "Password must contain numbers";
    }

    if (!formValues.confirmPassword.trim()) {
      validationErrors.confirmPassword = "ConfirmPassword is required";
    }
    if (formValues.password !== formValues.confirmPassword) {
      validationErrors.confirmPassword = "Password not match";
    }

    setError(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);

      Cookies.set("userEmail", formValues.email, { expires: 7 });
      axiosClient
        .post("/api/auth/register", formValues)
        .then(({ data }) => {
          setAuth({
            token: data.access_token,
            refresh_token: data.refresh_token,
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

  let duration = 2000;
  const showToastMessage = (data) => {
    toast.error(data, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: duration,
      hideProgressBar: true,
      draggable: true,
      closeOnClick: true,
    });
  };

  const errorMessage = localStorage.getItem("errorMessage");
  if (errorMessage) {
    showToastMessage(errorMessage);
    localStorage.removeItem("errorMessage");
  }
  return (
    <>
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
        <div className="m-auto ">
          <div className=" w-[100%]">
            <h2 className="text-textPrimary font-bold text-2xl phone:text-[18px]">
              Welcome to DCKAP Rhino Tome! 👋
            </h2>
            <h3 className="text-textPrimary font-medium phone:text-[14px]">
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
                    className="w-96 phone:w-[296px] h-9 mt-1 rounded-sm border-slate-900 p-2 text-sm outline-none outline-gray-200"
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
                      <p className="invisible p-1">Required</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-red-500 p-1">{errors.password}</p>
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
                    className="w-96 phone:w-[296px] h-9 mt-1 rounded-sm border-slate-900 p-2 text-sm outline-none outline-gray-200"
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
              <div className="flex justify-center">
                <Button name="Signup" />
              </div>
            </form>
            <div className="flex justify-center space-x-1 py-2">
              <span className="text-textPrimary ">
                Already have an account?
              </span>
              <Link to="/Signin" className="text-primary ">
                Signin Here
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
            <ToastContainer />
          </div>
        </div>
      </main>

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
    </>
  );
}
