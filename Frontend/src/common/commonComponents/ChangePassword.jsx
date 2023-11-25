import React from "react";

export const ChangePassword = (props) => {
  return (
    <div>
      <div className="bg-primary opacity-[0.5] w-screen h-screen absolute top-0 left-0  z-10"></div>
      <div className=" absolute left-0 top-0 z-20">
        <div className="bg-white h-[430px] w-[450px] ml-[420px] mt-[90px] rounded -z-10">
          <div className="" 
          onClick={props.handlePopup}
          >
            <i className="fa-solid fa-xmark text-red-500 pt-3 float-right text-2xl cursor-pointer mr-5"></i>
          </div>
          <div className="w-[300px] pt-12 pl-5 m-auto">
            <div className="mt-3">
              <label className="">Old Password</label>
              <div>
                <input
                  type="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded  block w-[250px] pl-2 p-2.5 focus:outline-none mt-1"
                  placeholder="Old Password"
                />
              </div>
            </div>
            <div className="mt-2">
              <label className="">New Password</label>
              <div>
                <input
                  type="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded  block w-[250px] pl-2 p-2.5 focus:outline-none mt-1"
                  placeholder="New Password"
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="">Confirm New Password</label>
              <div>
                <input
                  type="password"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded  block w-[250px] pl-2 p-2.5 focus:outline-none mt-1"
                  placeholder="Confirm New Password"
                />
              </div>
            </div>
            <button className="bg-primary mt-8 ml-6 h-12 w-48 text-white rounded text-center">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
