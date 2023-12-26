import React, { useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ClipboardJS from "clipboard";



export const UrlCopyPopup = ({ renderScript }) => {


  const params = useParams();
  const textToCopyRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageIds = queryParams.get("pageId");

  const [save,setSave] = useState("Copy")


  const handleNavigate = () => {
    navigate(`/dashboard/${params.uuid}/s/${params.slug}/?pageId=${pageIds}`);
  };

  return (
    <div>
      <div className="bg-[#a3a2e9] opacity-[0.5] w-screen h-screen absolute top-0 left-0  z-10"></div>
      <div className=" flex items-center justify-center h-screen w-screen absolute top-2/4 left-2/4 transform -translate-x-1/2 -translate-y-1/2 z-20 ">
        <div className="bg-white h-[240px] w-[600px]  rounded -z-10">
          <div className="" onClick={handleNavigate}>
            <i className="fa-solid fa-xmark text-red-500 pt-3 float-right text-2xl cursor-pointer mr-5"></i>
          </div>
          <div className="w-[550px] m-auto">
            <div className="flex pt-9 items-center space-x-2">
              <p className="text-2xl text-textPrimary">Published Url</p>
            </div>
            <div className="box-border mt-5 border-[#c5ccd8] w-full border-[1px] rounded-xl bg-white">
              <div className="w-[500px]  m-auto py-[8px]">
                <div className="flex justify-between items-center">
                  <p
                    className="text-[#616263]"
                    ref={textToCopyRef}
                  >{`http://localhost:3000/${params.uuid}${renderScript.path}`}</p>
                  <button
                    type="button"
                    ref={(button) => {
                      if (button) {
                        new ClipboardJS(button, {
                          text: () =>
                            `http://localhost:3000/${params.uuid}${renderScript.path}`, // Use the specific token for each button
                        }).on("success", (e) => {
                          e.clearSelection();
                          setSave("Copied");
                        });
                      }
                    }}
                    data-clipboard-text="Copy Text"
                    class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                  >
                    {save}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
