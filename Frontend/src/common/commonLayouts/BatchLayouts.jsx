import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const BatchLayouts = (props) => {
  const navigate = useNavigate();
  let params = useParams();
  let scripts = props.scripts;
  let batch = props.batch;

    const [inputValue, setInputValue] = useState('Initial Value');
  
    const handleBlur = () => {
      console.log('Input field lost focus with value:', inputValue);
      // Perform any actions you want when the input field loses focus
    };
  
    const handleChange = (e) => {
      setInputValue(e.target.value);
    };
  const handleScripts = (e) => {
    let TargetScriptId = e.target.id;
    navigate(`/dashboard/${params.uuid}/s/${TargetScriptId}`);
  };

  return (
    <div className="pt-16 h-[550px]  overflow-y-auto z-0">
      <div className=" ">
        <div className={`flex justify-between ${props.widths} m-auto  `}>
          <div>
            <div>
              <input
                className="text-[40px] ml-5  mt-8 font-bold focus:outline-none bg-[#ECEDEF] focus:bg-slate-100 h-14"
                placeholder="Batch Name"
                name="title"
                value={props.batchTitle}
                onChange={props.changeEvent}
                onBlur={props.handleBlur}
              />
            </div>
            <div className="mt-4">
              <input
                className="text-2xl ml-5 mt-5 focus:outline-none  bg-[#ECEDEF] h-10"
                placeholder="Batch Description"
                name="descritpion"
                value={
                  props.batchDescription
                }
                onChange={props.changeEvent}
                onBlur={props.handleDescriptionBlur}
              />
            </div>
          </div>
          <div></div>

          <div className="flex items-center space-x-5">
            {/* <button className="h-[40px] w-[121px] text-[#A8B0B7] rounded border-[#A8B0B7]  border-[1px] " >
              New Batch
            </button> */}
            <button
              className="h-[45px] w-[160px] text-white rounded  bg-primary"
              onClick={props.AddScript}
            >
              New Script
            </button>
          </div>
        </div>
        <div className="mt-8">
          <hr
            className={`h-px my-8 bg-[#D5D7DA] border-0 dark:bg-gray-900 ${props.widths} m-auto`}
          />
        </div>
        <div
          className={`${props.widths} m-auto flex flex-wrap gap-[30px] mt-10`}
        >
          {scripts &&
            scripts.map((script) => (
              <div
                className="bg-white w-[230px] h-[120px] rounded-[10px]"
                key={script.id}
              >
                <div className="bg-gradient-to-r from-primary to-[#226576] w-[230px] h-[36px] rounded-t-lg text-end pt-px">
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
                    0 Pages
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
