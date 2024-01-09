import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMyContext } from "../../context/AppContext";
import { formatDistanceToNow } from "date-fns";
import folder from "../../assets/images/folderKb.png";
import file from "../../assets/images/files.png";

export default function Main(props) {
  const deleteIconRef = useRef({});
  const deleteRef = useRef(null);

  const params = useParams();
  const navigate = useNavigate();
  const { screenHeight, setScreenHeight, userInfo, role, userDetail } =
    useMyContext();

  const [popUpState, setPopUpState] = useState(null);

  const batchList = props.batches;
  const scriptList = props.scripts;
  const scriptEvent = props.scriptEvent;
  const addBatchEvent = props.addBatchEvent;
  const scriptCount = props.scriptCount;

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
      }
    };

    const updateScreenHeight = () => {
      setScreenHeight(window.innerHeight);
    };

    // Attach the event listener for window resize
    window.addEventListener("resize", updateScreenHeight);
    window.addEventListener("click", closeOnOutsideClick);

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
    <div
      className="bg-[#F4F7FC]"
      style={{ height: `calc(${screenHeight}px - 64px)` }}
    >
      <div
        className="pt-5  overflow-auto  pl-[30px] pr-[30px]"
        style={{ maxHeight: `calc(${screenHeight}px - 64px)` }}
      >
        <div className=" w-[100%] m-auto">
          <div className={`flex justify-between  `}>
            <div className="flex space-x-3 pt-2">
              <div className="rounded-full h-12 w-12 bg-[#DEE0E4]">
                <i className="fa-solid fa-user-group text-[25px] pl-[6px] pt-[10px] text-[#6E7E86]"></i>
              </div>
              <div>
                <p className="text-xl phone:text-[14px] font-bold">
                  Team Documents
                </p>
                <p className="text-sm phone:text-[12px]">
                  {props.team} 's Teams
                </p>
              </div>
            </div>
            <div className="flex   items-center space-x-5 phone:space-x-2">
              <div>
                <button
                  className={`flex items-center justify-center space-x-1 hover:border-primary hover:text-primary  w-[128px]  phone:w-[80px] text-slate-500 rounded border-slate-400 phone:text-[10px] border-[1px]  `}
                  onClick={addBatchEvent}
                  disabled={role === 2 ? true : false}
                >
                  <span className="lg:py-[12px] phone:py-[5px] ">
                    <img src={folder} alt="" className="w-[17px] h-[18px]" />
                  </span>
                  <span>New Folder</span>
                </button>
              </div>
              <div>
                <button
                  className="flex items-center justify-center space-x-1 w-[160px] hover:bg-[#3d5fd8]  phone:w-[80px] text-white rounded  bg-primary phone:text-[10px]"
                  onClick={scriptEvent}
                  disabled={role === 2 ? true : false}
                >
                  <span className="lg:py-[13.5px] phone:py-[5px]">
                    <img src={file} alt="" className="w-[17px] h-[18px]" />
                  </span>
                  <span>New Section</span>
                </button>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <hr
              className={`h-px my-8 bg-[#D5D7DA] border-0 dark:bg-gray-900  m-auto`}
            />
          </div>
          <p className="font-semibold text-textPrimary text-xl phone:text-lg pl-1">
            FOLDERS
          </p>
          <div
            className={` m-auto grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 phone:grid-cols-2 gap-2 mt-2`}
          >
            {batchList && batchList.length > 0 ? (
              batchList.map((batch, index) => (
                <Link
                  to={`/dashboard/${params.uuid}/b/${batch.uuid}`}
                  key={index}
                >
                  <div
                    key={batch.id}
                    className="bg-white border-[1px] rounded-[10px] cursor-pointer  hover:border-primary relative   lg:p-[5px] xl:p-[10px] 2xl:p-[20px]"
                    id={batch.uuid}
                  >
                    <div
                      className="cursor-pointer phone:p-[5px] font-medium mt-2"
                      id={batch.uuid}
                    >
                      <div
                        className="flex justify-between items-center"
                        id={batch.uuid}
                      >
                        <div className="flex space-x-1 items-center">
                          <img
                            src={folder}
                            alt=""
                            className="w-[17px] h-[18px]"
                          />

                          <p
                            className="2xl:text-2xl phone:text-[14px]"
                            id={batch.uuid}
                          >
                            {batch.title}
                          </p>
                        </div>

                        {role == 2 ? (
                          ""
                        ) : (
                          <span
                            className="material-symbols-outlined text-primary cursor-pointer text-2xl phone:text-[14px] leading-[6px]"
                            onClick={deleteForeverPopup}
                            id={batch.uuid}
                            ref={(ref) =>
                              (deleteIconRef.current[batch.uuid] = ref)
                            }
                          >
                            more_vert
                          </span>
                        )}
                      </div>
                      {scriptCount[index] ? (
                        <p
                          id={batch.uuid}
                          className="text-gray-500 pt-1 phone:text-[12px]"
                        >
                          {scriptCount[index].script_count} Sections
                        </p>
                      ) : (
                        <p id={batch.uuid} className="text-gray-500">
                          0 Sections
                        </p>
                      )}
                    </div>
                    {popUpState == batch.uuid && (
                      <div
                        className="bg-white  shadow-lg h-[30px] border-2 hover:bg-primary hover:text-white border-slate-300 w-20 hover:rounded-lg absolute top-10 z-10 right-[-16px] rounded-lg "
                        ref={deleteRef}
                      >
                        <div
                          className="flex items-center  hover:rounded-lg  space-x-1"
                          id={batch.uuid}
                          onClick={props.handleTrash}
                        >
                          <i
                            className="fa-solid fa-trash cursor-pointer pl-1"
                            id={batch.uuid}
                            onClick={props.handleTrash}
                          ></i>

                          <p
                            className="cursor-pointer  text-[16px]   hover:rounded-lg"
                            id={batch.uuid}
                            onClick={props.handleTrash}
                          >
                            Delete
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-xl text-textPrimary ">
                No records of Folders
              </div>
            )}
          </div>
          <p className="font-semibold text-textPrimary text-xl phone:text-lg pt-5 pl-1">
            SECTIONS
          </p>
          <div
            className={` m-auto grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 phone:grid-cols-2  gap-2  mt-2`}
          >
            {scriptList && scriptList.length > 0 ? (
              scriptList.map((script, index) => (
                <Link
                  to={`/dashboard/${params.uuid}/s/${script.uuid}`}
                  key={index}
                >
                  <div
                    key={script.id}
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
                          {script.logo ? (
                            <img
                              src={script.logo}
                              alt=""
                              className="w-[17px] h-[18px]"
                            />
                          ) : (
                            <img
                              src={file}
                              alt=""
                              className="w-[17px] h-[18px]"
                            />
                          )}

                          <p
                            className="2xl:text-2xl phone:text-[14px]"
                            id={script.uuid}
                          >
                            {script.title}
                          </p>
                        </div>

                        {role == 2 ? (
                          ""
                        ) : (
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
                            className="fa-solid fa-trash cursor-pointer pl-1"
                            id={script.uuid}
                          ></i>

                          <p
                            className="cursor-pointer  text-[16px]  hover:rounded-lg"
                            id={script.uuid}
                          >
                            Delete
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-xl text-textPrimary ">
                No records of Sections
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
