import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Main(props) {
  const params = useParams();
  const navigate = useNavigate();
  const batchList = props.batches;
  const scriptList = props.scripts;
  const scriptEvent = props.scriptEvent;
  const addBatchEvent = props.addBatchEvent;
  const scriptCount = props.scriptCount;

  const handleBatch = (e) => {
    let TargetScriptId = e.target.id;
    navigate(`/dashboard/${params.uuid}/b/${TargetScriptId}`);
  };
  const handleScripts = (e) => {
    console.log(e.target);
    let TargetScriptId = e.target.id;
    navigate(`/dashboard/${params.uuid}/s/${TargetScriptId}`);
  };

  return (
    <div className="pt-10 h-[584px] overflow-y-auto z-0 bg-white">
      <div className="   ">
        <div className={`flex justify-between ${props.widths} m-auto  `}>
          <div className="flex space-x-3">
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
              className="h-[40px] w-[121px] text-primary rounded border-primary  border-[1px] "
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
            className={`h-px my-8 bg-[#D5D7DA] border-0 dark:bg-gray-900 ${props.widths} m-auto`}
          />
        </div>
        <p className="font-semibold text-textPrimary text-xl pl-6">BATCHS</p>
        <div
          className={`${props.widths} m-auto flex flex-wrap gap-[30px] mt-2`}
        >
          {batchList && batchList.length > 0 ? (
            batchList.map((batch, index) => (
              <div
                key={batch.uuid}
                className="bg-white w-[230px] h-[120px] rounded-[10px] shadow-lg hover:scale-105"
              >
                <div className="bg-gradient-to-r from-primary to-[#226576] w-[230px] h-[36px] rounded-t-lg text-end pt-px">
                  <span className="material-symbols-outlined text-white cursor-pointer text-2xl pr-1">
                    more_vert
                  </span>
                </div>
                <div
                  className="pl-5 pt-5 cursor-pointer"
                  id={batch.uuid}
                  onClick={handleBatch}
                >
                  <p id={batch.uuid} onClick={handleBatch}>
                    {batch.title}
                  </p>
                  {scriptCount[index] ? (
                    <p
                      id={batch.uuid}
                      onClick={handleBatch}
                      className="text-gray-500"
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
            ))
          ) : (
            <div className="text-xl text-textPrimary ">
              No records of Batchs
            </div>
          )}
        </div>
        <p className="font-semibold text-textPrimary text-xl pt-5 pl-6">
          SCRIPTS
        </p>

        <div
          className={`${props.widths} m-auto flex flex-wrap gap-[30px] mt-3`}
        >
          {scriptList && scriptList.length > 0 ? (
            scriptList.map((script) => (
              <div
                className="bg-white w-[230px] h-[120px] rounded-[10px] shadow-lg hover:scale-105"
                key={script.uuid}
              >
                <div className="bg-gradient-to-r from-primary to-[#226576] w-[230px] h-[36px] rounded-t-lg text-end pt-px ">
                  <span className="material-symbols-outlined text-white cursor-pointer text-2xl pr-1">
                    more_vert
                  </span>
                </div>
                <div
                  className="pl-5 pt-5 cursor-pointer"
                  id={script.uuid}
                  onClick={handleScripts}
                >
                  <p id={script.uuid} onClick={handleScripts}>
                    {script.title}
                  </p>
                  <p
                    id={script.uuid}
                    onClick={handleScripts}
                    className="text-gray-500"
                  >
                    0 page
                  </p>
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
  );
}
