import React, { useEffect, useState } from "react";
import { ChangePassword } from "../../common/commonComponents/ChangePassword";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { ToastContainer, toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

export const Profile = (props) => {
  const params = useParams();

  const [userName, setUserName] = useState("");
  const [changePasswordPopup, setChangePasswordPopup] = useState(false);
  const [userInfos, setUserInfo] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePopup = () => {
    setChangePasswordPopup((prevState) => !prevState);
  };

  useEffect(() => {
    userInfo();
  }, [params]);

  let duration = 2000;
  const showToastMessage = (data) => {
    toast.success(data, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: duration,
      hideProgressBar: true,
      draggable: true,
      closeOnClick: true,
    });
  };

  const showToastErrorMessage = (data) => {
    toast.warning(data, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const userInfo = async () => {
    await axiosClient
      .get("/getUserInfo")
      .then((res) => {
        setUserInfo(res.data.userInfo);
        setUserName(res.data.userInfo.username);
      })
      .catch((err) => {
        const response = err.response;
      });
  };

  const handleUserDetail = () => {
    let username = userName;
    if (username) {
      setLoading(true);
      axiosClient
        .put(`http://localhost:4000/userUpdateProfile`, { username: username })
        .then(({ data }) => {
          showToastMessage(data.message);
          setLoading(false);
        })
        .catch((err) => {
          const response = err.response;
          console.error("Error:", response.status);
        });
    } else {
      showToastErrorMessage("please fill the input field");
    }
  };

  return (
    <div className="ml-24 mt-10">
      <div className="bg-white w-[900px] h-[550px]  shadow-md mt-5">
        <div className="w-[800px] m-auto">
          <div>
            <p className="text-2xl font-bold text-textPrimary pt-10">
              My Profile
            </p>
            <div>img</div>
            <div className="mt-3">
              <label className="">UserName</label>
              <div>
                <input
                  type="text"
                  value={userName || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded block w-[500px] pl-2 p-2.5 focus:outline-primary mt-2"
                  placeholder="UserName"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="">Email</label>
              <div>
                <input
                  type="email"
                  value={(userInfos && userInfos.email) || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded  block w-[500px] pl-2 p-2.5 focus:outline-none mt-2"
                  placeholder="Email"
                  readOnly
                />
              </div>
            </div>
            <div className="mt-3 flex items-center space-x-5">
              <div>
                <label className="">Password</label>

                <input
                  type="password"
                  value={(userInfos && userInfos.password) || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded  block w-[500px] pl-2 p-2.5 focus:outline-none mt-2"
                  placeholder="Password"
                />
              </div>
              <button
                className="bg-primary mt-8 p-2.5 w-28 text-white border-0 rounded text-center"
                onClick={handlePopup}
              >
                Change
              </button>
            </div>
            <button
              className="bg-primary mt-5 h-12 w-48 text-white rounded text-center"
              onClick={handleUserDetail}
            >
              update
            </button>
          </div>
          {changePasswordPopup && <ChangePassword handlePopup={handlePopup} />}
        </div>
      </div>
      <ToastContainer />
      {loading && (
        <>
          <div className="bg-primary opacity-[0.5] w-[1289px] h-[664px] absolute top-0 left-0  z-10"></div>
          <p className="absolute top-72 left-[600px] z-40">
            <HashLoader color="#3197e8" />
          </p>
        </>
      )}
    </div>
  );
};
