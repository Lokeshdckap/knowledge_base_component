import React, { useState } from "react";
import axiosClient from "../../axios-client";
import HashLoader from "react-spinners/HashLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const ChangePassword = (props) => {
  const duration = 2000;

  const showToastMessage = (data) => {
    toast.success(data, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: duration,
      hideProgressBar: true,
      draggable: true,
      closeOnClick: true,
    });
  };

  const [formValues, setFormValues] = useState({});
  const [errors, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const HandleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    delete errors[name];
  };

  const resetPassword = (e) => {
    e.preventDefault();
    const validationErrors = {};
    if (!formValues.oldPassword) {
      validationErrors.oldPassword = "oldPassword is required";
    }
    if (!formValues.newPassword) {
      validationErrors.newPassword = "newPassword is required";
    }
    if (!formValues.confirmNewPassword) {
      validationErrors.confirmNewPassword = "confirmNewPassword is required";
    }
    if (formValues.newPassword !== formValues.confirmNewPassword) {
      validationErrors.confirmNewPassword = "Password not match";
    }

    setError(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);

      axiosClient
        .put(`http://localhost:4000/api/user/userUpdateProfile`, formValues)

        .then(({ data }) => {
          setLoading(false);
          showToastMessage(data.message);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 404) {
            let error = {};
            let value = Object.values(response.data);
            error["oldPassword"] = value;
            setError(error);
            setLoading(false);
          } else {
            console.error("Error:", response.status);
          }
        });
    }
  };

  return (
    <div>
      <div className="bg-[#a3a2e9] opacity-[0.5] w-screen h-screen absolute top-0 left-0  z-10"></div>
      <div className=" flex items-center justify-center h-screen w-screen absolute top-2/4 left-2/4 transform -translate-x-1/2 -translate-y-1/2 z-20 ">
        <div className="bg-white h-[430px] w-[450px]rounded -z-10">
          <div className="" onClick={props.handlePopup}>
            <i className="fa-solid fa-xmark text-red-500 pt-3 float-right text-2xl cursor-pointer mr-5"></i>
          </div>
          <div className="w-[300px] pt-12 pl-5 m-auto">
            <div className="">
              <label className="">Old Password</label>
              <div>
                <input
                  type="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded  block w-[250px] pl-2 p-2.5 focus:outline-none mt-1"
                  placeholder="Old Password"
                  name="oldPassword"
                  onChange={HandleChange}
                />
                <div className="mt-0 flex items-center justify-between ">
                  {!errors.oldPassword ? (
                    <div>
                      <p className="invisible">Required</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-red-500">{errors.oldPassword}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="">
              <label className="">New Password</label>
              <div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded  block w-[250px] pl-2 p-2.5 focus:outline-none mt-1"
                  placeholder="New Password"
                  name="newPassword"
                  onChange={HandleChange}
                />
                <div className="mt-0 flex items-center justify-between ">
                  {!errors.newPassword ? (
                    <div>
                      <p className="invisible">Required</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-red-500">{errors.newPassword}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="">
              <label className="">Confirm New Password</label>
              <div>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded  block w-[250px] pl-2 p-2.5 focus:outline-none mt-1"
                  placeholder="Confirm New Password"
                  name="confirmNewPassword"
                  onChange={HandleChange}
                />
                <div className="mt-0 flex items-center justify-between ">
                  {!errors.confirmNewPassword ? (
                    <div>
                      <p className="invisible">Required</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-red-500">
                        {errors.confirmNewPassword}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <button
              className="bg-[#a3a2e9] mt-4 ml-6 h-12 w-48 text-white rounded text-center"
              onClick={resetPassword}
            >
              Update
            </button>
          </div>
        </div>
        {loading && (
          <>
            <div className="bg-[#a3a2e9] opacity-[0.5] w-screen h-screen absolute top-0 left-0  z-10"></div>
            <p className="absolute top-72 left-[600px] z-40">
              <HashLoader color="#3197e8" />
            </p>
          </>
        )}
      </div>
    </div>
  );
};
