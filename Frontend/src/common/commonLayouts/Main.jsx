import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Main(props) {
  const deleteIconRef = useRef({});
  const deleteRef = useRef(null);

  const params = useParams();
  const navigate = useNavigate();

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

    window.addEventListener("click", closeOnOutsideClick);
    return () => {
      window.removeEventListener("click", closeOnOutsideClick);
    };
  }, [popUpState]);

  const handleBatch = (e) => {
    let TargetScriptId = e.target.id;
    navigate(`/dashboard/${params.uuid}/b/${TargetScriptId}`);
  };
  const handleScripts = (e) => {
    let TargetScriptId = e.target.id;
    navigate(`/dashboard/${params.uuid}/s/${TargetScriptId}`);
  };

  const deleteForeverPopup = (e) => {
    setPopUpState(e.target.id);
  };

  return (
    <div
      className="bg-[#F4F7FC]"

    >
      <div className="pt-2 2xl:max-h-[1000px] xl:max-h-[580px] overflow-auto  pl-[30px] pr-[30px]">
        <div className=" w-[100%] m-auto">
          <div className={`flex justify-between  `}>
            <div className="flex space-x-3 pt-2">
              <div className="rounded-full h-12 w-12 bg-[#DEE0E4]">
                <i className="fa-solid fa-user-group text-[25px] pl-2 pt-[10px] text-[#6E7E86]"></i>
              </div>
              <div>
                <h1 className="text-xl font-bold">Team Documents</h1>
                <h3 className="text-sm">{props.team} 's Teams</h3>
              </div>
            </div>
            <div className="flex items-center space-x-5">
              <button
                className="h-[40px] w-[121px] text-slate-500 rounded border-slate-400  border-[1px] "
                onClick={addBatchEvent}
              >
                New Batch
              </button>
              <button
                className="h-[45px] w-[160px] text-white rounded  bg-primary"
                onClick={scriptEvent}
              >
                New Script
              </button>
            </div>
          </div>
          <div className="mt-10">
            <hr
              className={`h-px my-8 bg-[#D5D7DA] border-0 dark:bg-gray-900  m-auto`}
            />
          </div>
          <p className="font-semibold text-textPrimary text-xl pl-1">BATCHS</p>
          <div
            className={` m-auto grid 2xl:grid-cols-5 xl:grid-cols-4 gap-2 mt-2`}
          >
            {batchList && batchList.length > 0 ? (
              batchList.map((batch, index) => (
                <div
                  key={batch.uuid}
                  className="bg-white border-[1px] rounded-[10px]  hover:border-primary relative xl:p-[10px] 2xl:p-[20px]"
                >
                  <div className="w-[100%] ">
                    <div className="rounded-t-lg text-end ">
                      <span
                        className="material-symbols-outlined text-primary cursor-pointer text-2xl "
                        onClick={deleteForeverPopup}
                        id={batch.uuid}
                        ref={(ref) => (deleteIconRef.current[batch.uuid] = ref)}
                      >
                        more_vert
                      </span>
                    </div>
                    <div
                      className="cursor-pointer  font-medium"
                      id={batch.uuid}
                      onClick={handleBatch}
                    >
                      <p
                        className="2xl:text-2xl"
                        id={batch.uuid}
                        onClick={handleBatch}
                      >
                        {batch.title}
                      </p>
                      {scriptCount[index] ? (
                        <p
                          id={batch.uuid}
                          onClick={handleBatch}
                          className="text-gray-500 pt-1"
                        >
                          {scriptCount[index].script_count} Scripts
                        </p>
                      ) : (
                        <p
                          id={batch.uuid}
                          onClick={handleBatch}
                          className="text-gray-500"
                        >
                          0 Scripts
                        </p>
                      )}
                    </div>
                  </div>
                  {popUpState == batch.uuid && (
                    <div
                      className="bg-white shadow-lg h-[30px] border-2 border-slate-300 w-20 absolute top-8 z-10 right-[-10px] rounded-lg"
                      ref={deleteRef}
                    >
                      <p
                        className="cursor-pointer  pl-3.5 pb-0.5 pt-0 hover:bg-primary text-textPrimary hover:text-white hover:rounded-lg"
                        id={batch.uuid}
                        onClick={props.handleTrash}
                      >
                        Delete
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-xl text-textPrimary ">
                No records of Batchs
              </div>
            )}
          </div>
          <p className="font-semibold text-textPrimary text-xl pt-5 pl-1">
            SCRIPTS
          </p>

          <div
            className={` m-auto grid 2xl:grid-cols-5 xl:grid-cols-4 gap-2  mt-2`}
          >
            {scriptList && scriptList.length > 0 ? (
              scriptList.map((script) => (
                <div
                  className="bg-white  border-[1px] rounded-[10px]  hover:border-primary  relative xl:p-[10px] 2xl:p-[20px]"
                  key={script.uuid}
                >
                  <div className="w-[100%]">
                    <div className=" rounded-t-lg text-end  ">
                      <span
                        className="material-symbols-outlined text-primary cursor-pointer text-2xl"
                        onClick={deleteForeverPopup}
                        id={script.uuid}
                        ref={(ref) =>
                          (deleteIconRef.current[script.uuid] = ref)
                        }
                      >
                        more_vert
                      </span>
                    </div>
                    <div
                      className="px-5 font-medium cursor-pointer"
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
                </div>
              ))
            ) : (
              <div className="text-xl text-textPrimary ">
                No records of Scripts
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
