import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMyContext } from "../../context/AppContext";
import { formatDistanceToNow } from "date-fns";
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
    setPopUpState(e.target.id);
  };

  const handleScripts = (e) => {
    let TargetScriptId = e.target.id;
    navigate(`/dashboard/${params.uuid}/s/${TargetScriptId}`);
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
                  className="text-[40px] phone:text-[24px] phone:w-[240px]  pl-2 mt-8 font-bold focus:outline-none hover:bg-slate-100  rounded focus:bg-slate-100 h-14 phone:h-12"
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
                  className="text-2xl phone:text-[18px] pl-2 focus:outline-none phone:w-[230px]  focus:bg-slate-100 hover:bg-slate-100 h-10 phone:h-8 rounded"
                  placeholder="Batch Description"
                  name="descritpion"
                  value={props.batchDescription || ""}
                  onChange={props.changeEvent}
                  onBlur={props.handleDescriptionBlur}
                  disabled={role === 2 ? true : false}
                />
              </div>
            </div>
            <div className="flex items-center space-x-5 pt-6 ">
              <button
                className="h-[45px] w-[160px] phone:h-[35px] phone:w-[100px]  text-white rounded  bg-primary"
                onClick={props.AddScript}
                id={params.slug}
                disabled={role === 2 ? true : false}
              >
                New Section
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
            {scripts &&
              scripts.map((script) => (
                <div
                  className="bg-white  border-[1px] rounded-[10px] hover:border-primary  relative lg:p-[5px] xl:p-[10px] 2xl:p-[20px]"
                  key={script.id}
                >
                  <div className="w-[100%] phone:p-[5px]">
                    <div className="rounded-t-lg text-end pt-px">
                      {role == 2 ? (
                        ""
                      ) : (
                        <span
                          className="material-symbols-outlined text-primary cursor-pointer phone:text-[14px] text-2xl "
                          id={script.uuid}
                          onClick={deleteForeverPopup}
                          ref={(ref) =>
                            (deleteIconRef.current[script.uuid] = ref)
                          }
                        >
                          more_vert
                        </span>
                      )}
                    </div>
                    <div
                      className=" font-medium cursor-pointer"
                      id={script.uuid}
                      onClick={handleScripts}
                    >
                      <p
                        className="2xl:text-2xl phone:text-[14px]"
                        id={script.uuid}
                        onClick={handleScripts}
                      >
                        {script.title}
                      </p>
                      <p
                        id={script.uuid}
                        onClick={handleScripts}
                        className="text-gray-500 pt-1 phone:text-[12px] text-sm"
                      >
                        Edited:{" "}
                        {formatDistanceToNow(new Date(script.updatedAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  {popUpState == script.uuid && (
                    <div
                      className="bg-white shadow-lg h-[30px] border-2 border-slate-300 w-20 absolute top-9 z-10 right-[-10px] rounded-lg"
                      ref={deleteRef}
                    >
                      <p
                        className="cursor-pointer  pl-3.5 pb-0.5 pt-0 hover:bg-primary text-textPrimary hover:text-white hover:rounded-lg"
                        id={script.uuid}
                        onClick={props.handleTrash}
                      >
                        Delete
                      </p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
