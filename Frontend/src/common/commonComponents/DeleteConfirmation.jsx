import React from "react";
import { PopupButton } from "./PopupButton";

export const DeleteConfirmation = (props) => {
  return (
    <div>
      <div className="bg-[#a3a2e9] opacity-[0.5] w-screen h-screen absolute top-0 left-0  z-10"></div>
      <div className=" absolute left-0 top-0 z-20">
        <div className="bg-white h-[290px] w-[600px] ml-[350px] mt-[140px] rounded -z-10">
          <div className="" onClick={props.deleteAllPopup}>
            <i className="fa-solid fa-xmark text-red-500 pt-3 float-right text-2xl cursor-pointer mr-5"></i>
          </div>
          <div className="w-[480px] m-auto">
            <div className="flex pt-9 items-center space-x-2">
              <i className="fa-solid fa-trash text-xl"></i>
              <p className="text-2xl text-textPrimary">Delete Scripts</p>
            </div>
            <p className="pt-8 text-lg text-textPrimary">
              Are you sure you want to DeleteAll the Scritps & Pages but you can't restore ?
            </p>
            <div className="flex items-center justify-end space-x-6  pt-10">
              <div className={`text-center`}>
                <button
                  className="text-gray-600 font-bold py-2.5 px-10 rounded border border-gray-300 "
                  onClick={props.deleteAllPopup}
                >
                  Cancel
                </button>
              </div>
              <div className={`text-center`}>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-5 rounded"
                  onClick={props.handleDelete}
                >
                  Delete Forever
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
