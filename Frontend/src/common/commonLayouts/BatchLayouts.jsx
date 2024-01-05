import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMyContext } from "../../context/AppContext";
import { formatDistanceToNow } from "date-fns";
import file from "../../assets/images/files.png";

export const BatchLayouts = (props) => {
  const deleteIconRef = useRef({});
  const deleteRef = useRef(null);

  const params = useParams();
  const navigate = useNavigate();
  const { screenHeight, setScreenHeight, role } = useMyContext();
  const [popUpState, setPopUpState] = useState(null);

  let scripts = props.scripts;
  let batch = props.batch;

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (deleteRef.current !== null) {
        if (
          popUpState &&
          !deleteRef.current.contains(e.target) &&
          !Object.values(deleteIconRef.current).includes(e.target)
        ) {
          setPopUpState(null);
        }
        console.log("oo");
      }
    };

    const updateScreenHeight = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener("click", closeOnOutsideClick);
    window.addEventListener("resize", updateScreenHeight);
    return () => {
      window.removeEventListener("click", closeOnOutsideClick);
      window.removeEventListener("resize", updateScreenHeight);
    };
  }, [popUpState]);

  const deleteForeverPopup = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPopUpState(e.target.id);
  };

  return (
    <div className="bg-[#F4F7FC] " style={{ height: "calc(100% - 64px)" }}>
      <div
        className=" pl-[30px] pr-[30px] overflow-auto"
        style={{ maxHeight: `calc(${screenHeight}px - 64px)` }}
      >
        <div className="w-[100%] m-auto">
          <div className={`flex justify-between items-center`}>
            <div>
              <div>
                <input
                  className="text-[40px] phone:text-[24px] phone:w-[240px]  pl-2 mt-8 font-bold focus:outline-none  hover:bg-[#e6ebf8] bg-[#F4F7FC]  rounded focus:bg-[#e6ebf8] h-14 phone:h-12 text-[#404958]"
                  placeholder="Batch Name"
                  name="title"
                  value={props.batchTitle || ""}
                  onChange={props.changeEvent}
                  onBlur={props.handleBlur}
                  disabled={role === 2 ? true : false}
                />
              </div>
              <div className="mt-4">
                <input
                  className="text-2xl phone:text-[18px] pl-2 focus:outline-none phone:w-[230px] text-[#363d49] bg-[#F4F7FC] focus:bg-[#e6ebf8] hover:bg-[#e6ebf8] h-10 phone:h-8 rounded"
                  placeholder="Batch Description"
                  name="descritpion"
                  value={props.batchDescription || ""}
                  onChange={props.changeEvent}
                  onBlur={props.handleDescriptionBlur}
                  disabled={role === 2 ? true : false}
                />
              </div>
            </div>
            <div onClick={props.AddChildScript}>
              <button
                className="flex items-center justify-center space-x-1 w-[160px] hover:bg-[#3d5fd8]   phone:w-[80px] text-white rounded  bg-primary phone:text-[10px]"
                disabled={role === 2 ? true : false}
              >
                <span className="lg:py-[13.5px] phone:py-[5px]">
                  <img src={file} alt="" className="w-[17px] h-[18px]" />
                </span>
                <span>New Section</span>
              </button>
            </div>
          </div>
          <div className="mt-8">
            <hr
              className={`h-px my-8 bg-[#D5D7DA] border-0 dark:bg-gray-900 m-auto`}
            />
          </div>
          <p className="font-semibold text-textPrimary text-xl phone:text-lg pl-1">
            New Section
          </p>
          <div
            className={`m-auto grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 phone:grid-cols-2 gap-2 mt-2`}
          >
            {scripts && scripts.length > 0 ? (
              scripts.map((script, index) => (
                <Link
                  to={`/dashboard/${params.uuid}/s/${script.uuid}`}
                  key={index}
                >
                  <div
                    key={script.uuid}
                    className="bg-white border-[1px] rounded-[10px] cursor-pointer  hover:border-primary relative   lg:p-[5px] xl:p-[10px] 2xl:p-[20px]"
                    id={script.uuid}
                  >
                    <div
                      className="cursor-pointer phone:p-[5px] font-medium mt-2"
                      id={script.uuid}
                    >
                      <div
                        className="flex justify-between items-center"
                        id={script.uuid}
                      >
                        <div className="flex space-x-1 items-center">
                          <img
                            src={file}
                            alt=""
                            className="w-[17px] h-[18px]"
                          />

                          <p
                            className="2xl:text-2xl phone:text-[14px]"
                            id={script.uuid}
                          >
                            {script.title}
                          </p>
                        </div>

                        {role === 2
                          ? ""
                          : (
                              <span
                                className="material-symbols-outlined text-primary cursor-pointer text-2xl phone:text-[14px] leading-[6px]"
                                onClick={deleteForeverPopup}
                                id={script.uuid}
                                ref={(ref) =>
                                  (deleteIconRef.current[script.uuid] = ref)
                                }
                              >
                                more_vert
                              </span>
                            )}
                      </div>
                      <p
                        id={script.uuid}
                        className="text-gray-500 pt-2 phone:text-[12px] text-sm"
                      >
                        Edited:{" "}
                        {formatDistanceToNow(new Date(script.updatedAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    {popUpState == script.uuid && (
                      <div
                        className="bg-white  shadow-lg h-[30px] border-2 hover:bg-primary hover:text-white border-slate-300 w-20 hover:rounded-lg absolute top-10 z-10 right-[-16px] rounded-lg "
                        ref={deleteRef}
                      >
                        <div
                          className="flex items-center  hover:rounded-lg  space-x-1"
                          id={script.uuid}
                          onClick={props.handleTrash}
                        >
                          <i
                            className="fa-solid fa-trash cursor-pointer pl-1 "
                            id={script.uuid}
                          ></i>
                          <p
                            className="cursor-pointer  text-[16px] hover:rounded-lg"
                            id={script.uuid}
                          >
                            Delete
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))):(    <div className="text-xl text-textPrimary ">
              No records of Sections
            </div>)}
          </div>
        </div>
      </div>
    </div>
  );
};
