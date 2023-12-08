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
  const [selected, setSelected] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const [image, setImage] = useState(null);

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
        setSelectedImage(res.data.userInfo.avatar);
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
      const formData = new FormData();
      formData.append('username', username);
      formData.append('image', image); // Assuming you have an 'avatar' file to upload
      
      axiosClient
        .put(
          'http://localhost:4000/userUpdateProfile',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        .then(({ data }) => {
          showToastMessage(data.message);
          setLoading(false);
        })
        .catch((err) => {
          const response = err.response;
          console.error('Error:', response.status);
        });
      
    } else {
      showToastErrorMessage("please fill the input field");
    }
  };

  const [selectedImage, setSelectedImage] = useState();

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // You can perform additional checks here if needed
      setSelectedImage(URL.createObjectURL(file));
      setImage(file);
    }
  };
  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="ml-24 mt-5">
      <div className="bg-white w-[900px] h-[550px]  shadow-md">
        <div className="w-[800px] m-auto">
          <div>
            <p className="text-2xl font-bold text-textPrimary pt-10">
              My Profile
            </p>
            <div
              className={`w-32 h-32 ${!selectedImage && "border-dotted"} ${
                !selected && "border-2"
              } border-gray-400 relative overflow-hidden`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {selectedImage ? (
                <>
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="object-cover w-full h-full"
                  />
                  {isHovered && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <label htmlFor="imageInput" className="cursor-pointer">
                        <span className="text-white">Upload</span>
                        <input
                          type="file"
                          id="imageInput"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                  )}
                  <button
                    className="absolute top-0 right-0 m-2 p-1 bg-white text-gray-600 hover:text-red-500 hover:bg-red-100 rounded-full focus:outline-none"
                    onClick={handleRemoveImage}
                  >
                    X
                  </button>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <label htmlFor="imageInput" className="cursor-pointer">
                    <span className="text-gray-500">Click to upload</span>
                    <input
                      type="file"
                      id="imageInput"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
            </div>
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

      {console.log(image)}
    </div>
  );
};
