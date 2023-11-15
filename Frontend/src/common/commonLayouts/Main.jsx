import React from "react";
import { useNavigate } from "react-router-dom";

export default function Main(props) {


  const navigate = useNavigate()
  const teamName =props.team.name;
  const batchList = props.batches;
  const scriptList = props.scripts;
  const scriptEvent = props.scriptEvent;
  const addBatchEvent = props.addBatchEvent;
  const scriptCount = props.scriptCount



  const handleBatch = (e) => {
   
    let TargetScriptId = e.target.id;
    navigate(
      `/dashboard/${props.team.uuid}/b/${TargetScriptId}`
    );
  };
  const handleScripts = (e) => {
    let TargetScriptId = e.target.id;
    navigate(
      `/dashboard/${props.team.uuid}/s/${TargetScriptId}`
    );
  };
  

  return (
    <div className="pt-16 h-[520px] overflow-y-auto z-0">
      <div className="   ">
        <div className={`flex justify-between ${props.widths} m-auto  `}>
          <div className="flex space-x-3">
            <div className="rounded-full h-12 w-12 bg-[#DEE0E4]">
              <i className="fa-solid fa-user-group text-[25px] pl-2 pt-[10px] text-[#6E7E86]"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold">Team Documents</h1>
              <h3 className="text-sm">{teamName} 's Teams</h3>
            </div>
          </div>
          <div className="flex items-center space-x-5">
            <button className="h-[40px] w-[121px] text-[#A8B0B7] rounded border-[#A8B0B7]  border-[1px] " onClick={addBatchEvent}>
              New Batch
            </button>
            <button className="h-[45px] w-[160px] text-white rounded  bg-primary" onClick={scriptEvent}>
              New Script
            </button>
          </div>
        </div>
        <div className="mt-14">
          <hr
            className={`h-px my-8 bg-[#D5D7DA] border-0 dark:bg-gray-900 ${props.widths} m-auto`}
          />
        </div>
        {/* <div className={`${props.widths} m-auto flex flex-wrap gap-[30px] `}>
          {scriptCount.map((batch) => 
            <div className="bg-white w-[230px] h-[120px] rounded-[10px]">
              <div className="bg-gradient-to-r from-primary to-[#226576] w-[230px] h-[36px] rounded-t-lg text-end pt-px">
                <span className="material-symbols-outlined text-white cursor-pointer text-2xl pr-1">
                  more_vert
                </span>
              </div>
              <div className="pl-5 pt-5">
                <p className="truncate">{batch.title}</p>
                <p className="text-gray-500">{batch.script_count} Scripts</p>
              </div>
            </div>
          )}
        </div> */}
        <div className={`${props.widths} m-auto flex flex-wrap gap-[30px] mt-10`}>
          {batchList.map((batch) => 
            <div className="bg-white w-[230px] h-[120px] rounded-[10px]">
              <div className="bg-gradient-to-r from-primary to-[#226576] w-[230px] h-[36px] rounded-t-lg text-end pt-px ">
                <span className="material-symbols-outlined text-white cursor-pointer text-2xl pr-1">
                  more_vert
                </span>
              </div>
              <div className="pl-5 pt-5 cursor-pointer" id={batch.uuid} onClick={handleBatch}>
                <p id={batch.uuid} onClick={handleBatch}>{batch.title}</p>
                <p id={batch.uuid} onClick={handleBatch} className="text-gray-500">0 script</p>
              </div>
            </div>
          )}
        </div>
        <div className={`${props.widths} m-auto flex flex-wrap gap-[30px] mt-10`}>
          {scriptList.map((script) => 
            <div className="bg-white w-[230px] h-[120px] rounded-[10px]">
              <div className="bg-gradient-to-r from-primary to-[#226576] w-[230px] h-[36px] rounded-t-lg text-end pt-px ">
                <span className="material-symbols-outlined text-white cursor-pointer text-2xl pr-1">
                  more_vert
                </span>
              </div>
              <div className="pl-5 pt-5 cursor-pointer" id={script.uuid} onClick={handleScripts}>
                <p id={script.uuid} onClick={handleScripts}>{script.title}</p>
                <p id={script.uuid}  onClick={handleScripts} className="text-gray-500">0 page</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
