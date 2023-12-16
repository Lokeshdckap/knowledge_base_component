import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMyContext } from "../../context/AppContext";

export default function Main(props) {
  const deleteIconRef = useRef({});
  const deleteRef = useRef(null);

  const params = useParams();
  const navigate = useNavigate();
  const {
    screenHeight, setScreenHeight
  } = useMyContext();


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
    window.addEventListener('resize', updateScreenHeight);
    window.addEventListener("click", closeOnOutsideClick);

    return () => {
      window.removeEventListener("click", closeOnOutsideClick);
      window.removeEventListener("resize", updateScreenHeight);
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
    <div className="bg-[#F4F7FC]"
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
                <h1 className="text-xl phone:text-[14px] font-bold">Team Documents</h1>
                <h3 className="text-sm phone:text-[12px]">{props.team} 's Teams</h3>
              </div>
            </div>
            <div className="flex items-center space-x-5 phone:space-x-2">
              <button
                className="h-[40px] w-[121px] phone:h-[25px] phone:w-[60px] text-slate-500 rounded border-slate-400 phone:text-[10px] border-[1px] "
                onClick={addBatchEvent}
              >
                New Batch
              </button>
              <button
                className="h-[45px] w-[160px] phone:h-[28px] phone:w-[80px] text-white rounded  bg-primary phone:text-[10px]"
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
          <p className="font-semibold text-textPrimary text-xl phone:text-lg pl-1">BATCHS</p>
          <div
            className={` m-auto grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 phone:grid-cols-2 gap-2 mt-2`}
          >
            {batchList && batchList.length > 0 ? (
              batchList.map((batch, index) => (
                <div
                  key={batch.uuid}
                  className="bg-white border-[1px] rounded-[10px]  hover:border-primary relative   lg:p-[5px] xl:p-[10px] 2xl:p-[20px]"
                >
                  <div className="w-[100%] phone:p-[5px] ">
                    <div className="rounded-t-lg text-end ">
                      <span
                        className="material-symbols-outlined text-primary cursor-pointer text-2xl phone:text-[14px] leading-[6px]"
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
                        className="2xl:text-2xl phone:text-[14px]"
                        id={batch.uuid}
                        onClick={handleBatch}
                      >
                        {batch.title}
                      </p>
                      {scriptCount[index] ? (
                        <p
                          id={batch.uuid}
                          onClick={handleBatch}
                          className="text-gray-500 pt-1 phone:text-[12px]"
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
          <p className="font-semibold text-textPrimary text-xl phone:text-lg pt-5 pl-1">
            SCRIPTS
          </p>

          <div
            className={` m-auto grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 phone:grid-cols-2  gap-2  mt-2`}
          >
            {scriptList && scriptList.length > 0 ? (
              scriptList.map((script) => (
                <div
                  className="bg-white  border-[1px] rounded-[10px]  hover:border-primary  relative lg:p-[5px] xl:p-[10px] 2xl:p-[20px]"
                  key={script.uuid}
                >
                  <div className="w-[100%] phone:p-[5px]">
                    <div className=" rounded-t-lg text-end  ">
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
                    </div>
                    <div
                      className="font-medium cursor-pointer"
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
                        className="text-gray-500 pt-1 phone:text-[12px]"
                      >
                      Pages
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
