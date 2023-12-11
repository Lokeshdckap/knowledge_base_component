import React, { useEffect, useRef, useState } from "react";
import { Switch } from "antd";
import ClipboardJS from "clipboard";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
export const PublishPopup = (props) => {
  const navigate = useNavigate();
  const textToCopyRef = useRef(null);
  const buttonRef = useRef(null);
  let clipboard = null;
  const params = useParams();

  const [check, setCheck] = useState(props.renderScript);

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

  useEffect(() => {
    clipboard = new ClipboardJS(buttonRef.current, {
      text: () => textToCopyRef.current.innerText,
    });
    clipboard.on("success", (e) => {
      e.clearSelection(); // Deselect the text
      showToastMessage("Text copied to clipboard!");
    });

    return () => {
      if (clipboard) {
        clipboard.destroy();
      }
    };
  }, [props.renderScript]);

  const handleNavigates = () => {
    props.setShareState(false);
    navigate(`/dashboard/${params.uuid}/s/${params.slug}`);
  };

  return (
    <div>
      <div className="bg-[#a3a2e9] opacity-[0.5] w-screen h-screen absolute top-0 left-0  z-10"></div>
      <div className=" absolute left-0 top-0 z-20">
        <div className="bg-white h-[500px] w-[900px] ml-[200px] mt-[60px] rounded-lg -z-10">
          <div className="flex">
            <div className="w-[280px] mt-8">
              <div className="w-[200px] m-auto space-y-1">
                <div className="hover:bg-[#e5e8f1] p-2 cursor-pointer rounded bg-[#e5e8f1]">
                  <p>Publish to the web</p>
                </div>
              </div>
            </div>
            <div className="bg-[#e5e8f1] w-[650px] h-[500px] rounded-r-lg">
              <div className="">
                <i
                  className="fa-solid fa-xmark text-[#8f97aa] pt-2 float-right text-2xl cursor-pointer mr-5"
                  onClick={handleNavigates}
                ></i>
              </div>
              <div className="w-[580px] m-auto mt-9 space-y-2">
                <p className="text-2xl font-semibold text-textPrimary">
                  Publish to the web
                </p>
                <p className="text-lg text-[#394863]">
                  Share your content online with a customizable layout.
                </p>
                <div className="box-border border-[#c5ccd8] h-28 w-full border-[1px] rounded bg-white">
                  <div className="flex w-[530px] m-auto space-x-5 mt-3.5">
                    <div>
                      <div className="rounded-full h-8 w-8 bg-primary mt-5">
                        <i className="fa-solid fa-globe text-lg pl-1.5 pt-[0.5px] text-white"></i>
                      </div>
                    </div>
                    <div className="flex space-x-16 ">
                      <div>
                        <p className="text-textPrimary text-xl ">
                          Publish this space to the web
                        </p>
                        <p className="text-textPrimary text-[14px] w-[350px] m-auto pt-1">
                          With an unique configurable URL, indexable by search
                          engines.
                        </p>
                      </div>
                      <div className="pt-5">
                        <Switch
                          checked={props.renderScript.is_published}
                          onChange={props.onChange}
                          className="bg-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {check.is_published == 0 ? "" : <div>No content</div>}
                <div className="box-border border-[#c5ccd8] h-32 w-full border-[1px] rounded bg-white">
                  <div className="w-[500px] m-auto">
                    <div className="flex justify-between mt-4 items-center">
                      <p className="text-xl">Script Title</p>
                      <div className="box-border border-[#c5ccd8] h-10 w-28 border-[1px] rounded-lg bg-primary flex space-x-2">
                        <a
                          href={
                            !props.renderScript.is_published
                              ? ""
                              : `http://localhost:3000/${params.uuid}${props.renderScript.path}`
                          }
                          target="blank"
                        >
                          {" "}
                          <p>
                            <i className="fa-solid fa-up-right-from-square pl-2 pt-2.5 text-white "></i>
                          </p>
                        </a>
                        <a
                          href={
                            !props.renderScript.is_published
                              ? ""
                              : `http://localhost:3000/${params.uuid}${props.renderScript.path}`
                          }
                          target="blank"
                        >
                          <p className="pt-1.5  text-white ">Visit Site</p>
                        </a>
                      </div>
                    </div>
                    <div className="box-border border-[#c5ccd8] w-full border-[1px] rounded bg-sky-100 mt-4 ">
                      <div className="flex justify-between w-[450px] items-center m-auto">
                        <p
                          ref={textToCopyRef}
                          className="text-sm text-textPrimary"
                        >
                          {!props.renderScript.is_published
                            ? ""
                            : `http://localhost:3000/${params.uuid}${props.renderScript.path}`}
                        </p>
                        <div className="bg-white p-1 mt-1 mb-1 cursor-pointer">
                          <p
                            className="text-lg text-gray-400"
                            ref={buttonRef}
                            data-clipboard-text="Copy Text"
                          >
                            <i className="fa-regular fa-copy text-lg  text-gray-400"></i>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
