import React from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
export const ViewHeader = (props) => {
  console.log(props.publish);

  const params = useParams()
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
  const copyLink = ()=>{
   let path =  `http://localhost:3000/${params.uuid}${props.renderScript.path}`
   navigator.clipboard.writeText(path)
   showToastMessage("Link Copied !");
  }
  return (
    <div className="bg-[#ffff] w-[100%] ">
      <div
        className={`flex items-center m-auto justify-between relative w-[100%]  2xl:py-[30px] pt-[10px] pb-[10px] pl-[30px] pr-[30px]`}
      >
        <input
          className="text-textPrimary font-bold font-sans text-2xl bg-[#EEEEEE] focus:outline-gray-300 w-80 h-11 pl-2 rounded"
          value={props.inputValue}
          readOnly={true}
        />
        <div>
        <button
            type="button"
            className="text-white bg-primary hover:bg-sky-600 font-medium text-sm h-9 w-24  focus:outline-none rounded mr-2 mb-2"
            onClick={copyLink}
          >
            Copy Link
          </button>
          <button
            type="button"
            className="text-textPrimary border-[1px] border-gray-400 font-medium rounded-lg text-sm h-9 w-24 mr-2 mb-2 "
            onClick={props.handleEdit}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};
