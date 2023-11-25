import React, { useState } from "react";
import { TeamSideNav } from "../../common/commonLayouts/TeamSideNav";
import { ChangePassword } from "../../common/commonComponents/ChangePassword";

export const Profile = (props) => {

    const [changePasswordPopup,setChangePasswordPopup] = useState(false);

    const handlePopup = () =>{
        setChangePasswordPopup((prevState) => !prevState)
    }
  return (
    <div className="ml-24 mt-10">
      <div className="bg-white w-[900px] h-[550px]  shadow-md mt-5">
        <div className="w-[800px] m-auto">
          <div>
            <p className="text-2xl font-bold text-textPrimary pt-10">
              My Profile
            </p>
            <div>imga</div>
            <div className="mt-3">
              <label className="">UserName</label>
              <div>
                <input
                  type="text"
                  value={(props.userInfos && props.userInfos.username) || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded  block w-[500px] pl-2 p-2.5 focus:outline-primary mt-2"
                  placeholder="UserName"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="">Email</label>
              <div>
                <input
                  type="email"
                  value={(props.userInfos && props.userInfos.email) || ""}
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
                  value={(props.userInfos && props.userInfos.password) || ""}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded  block w-[500px] pl-2 p-2.5 focus:outline-none mt-2"
                  placeholder="Password"
                />
              </div>
              <button className="bg-primary mt-8 p-2.5 w-28 text-white border-0 rounded text-center"
                onClick={handlePopup}
              >
                Change
              </button>
            </div>
            <button className="bg-primary mt-5 h-12 w-48 text-white rounded text-center">
              update
            </button>
          </div>
          {changePasswordPopup && <ChangePassword 
            handlePopup={handlePopup}
          />}
        </div>
      </div>
    </div>
  );
};
