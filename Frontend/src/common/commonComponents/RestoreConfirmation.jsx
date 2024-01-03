import React from "react";
import { PopupButton } from "./PopupButton";

export const RestoreConfirmation = (props) => {
  const handleClose = () => {
    props.setHandleRestoreConfirmation(null);
  };
  return (
    <div>
      <div className="bg-[#a3a2e9] opacity-[0.5] w-screen h-screen absolute top-0 left-0  z-10"></div>
      <div className=" flex items-center justify-center h-screen w-screen absolute top-2/4 left-2/4 transform -translate-x-1/2 -translate-y-1/2 z-20 ">
        <div className="bg-white h-[290px] w-[600px]  rounded -z-10">
          <div className="">
            <i
              className="fa-solid fa-xmark text-red-500 pt-3 float-right text-2xl cursor-pointer mr-5"
              onClick={handleClose}
            ></i>
          </div>
          <div className="w-[480px] m-auto">
            <div className="flex pt-9 items-center space-x-2">
              <i class="fa-solid fa-trash-can-arrow-up text-2xl"></i>
              <p className="text-2xl text-textPrimary">Restore folder and all of its sections</p>
            </div>
            <p className="pt-8 text-lg text-textPrimary">
            Do you want to restore the folder and all of its sections?
            </p>
            <div className="flex items-center justify-end space-x-6  pt-10">
              <div className={`text-center`} onClick={handleClose}>
                <button className="text-gray-600 font-bold py-2.5 px-10 rounded border border-gray-300 ">
                  Cancel
                </button>
              </div>
              {/* <div className={`text-center`}>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-5 rounded"
                                 >
                  Restore
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
