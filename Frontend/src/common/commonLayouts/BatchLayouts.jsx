import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMyContext } from "../../context/AppContext";

export const BatchLayouts = (props) => {
  const deleteIconRef = useRef({});
  const deleteRef = useRef(null);

  const params = useParams();
  const navigate = useNavigate();
  const { screenHeight, setScreenHeight } = useMyContext();
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
          <div className={`flex justify-between`}>
            <div>
              <div>
                <input
                  className="text-[40px]  pl-2 mt-8 font-bold focus:outline-none hover:bg-slate-100  rounded focus:bg-slate-100 h-14"
                  placeholder="Batch Name"
                  name="title"
                  value={props.batchTitle || ""}
                  onChange={props.changeEvent}
                  onBlur={props.handleBlur}
                />
              </div>
              <div className="mt-4">
                <input
                  className="text-2xl mt-5 pl-2 focus:outline-none  focus:bg-slate-100 hover:bg-slate-100 h-10 rounded"
                  placeholder="Batch Description"
                  name="descritpion"
                  value={props.batchDescription || ""}
                  onChange={props.changeEvent}
                  onBlur={props.handleDescriptionBlur}
                />
              </div>
            </div>
            <div className="flex items-center space-x-5 pt-3 ">
              <button
                className="h-[45px] w-[160px] text-white rounded  bg-primary"
                onClick={props.AddScript}
                id={params.slug}
              >
                New Script
              </button>
            </div>
          </div>
          <div className="mt-8">
            <hr
              className={`h-px my-8 bg-[#D5D7DA] border-0 dark:bg-gray-900 m-auto`}
            />
          </div>
          <p className="font-semibold text-textPrimary text-xl  pl-1">
            SCRIPTS
          </p>
          <div
            className={`m-auto grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 gap-2 mt-2`}
          >
            {scripts &&
              scripts.map((script) => (
                <div
                  className="bg-white  border-[1px] rounded-[10px] hover:border-primary  relative lg:p-[5px] xl:p-[10px] 2xl:p-[20px]"
                  key={script.id}
                >
                  <div className="w-[100%]">
                    <div className="rounded-t-lg text-end pt-px">
                      <span
                        className="material-symbols-outlined text-primary cursor-pointer text-2xl "
                        id={script.uuid}
                        onClick={deleteForeverPopup}
                        ref={(ref) =>
                          (deleteIconRef.current[script.uuid] = ref)
                        }
                      >
                        more_vert
                      </span>
                    </div>
                    <div
                      className=" font-medium cursor-pointer"
                      id={script.uuid}
                      onClick={handleScripts}
                    >
                      <p
                        className="2xl:text-2xl"
                        id={script.uuid}
                        onClick={handleScripts}
                      >
                        {script.title}
                      </p>
                      <p
                        id={script.uuid}
                        onClick={handleScripts}
                        className="text-gray-500 pt-1"
                      >
                        0 Pages
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
