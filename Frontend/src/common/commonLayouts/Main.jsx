import React from "react";

export default function Main(props) {
  return (
    <div className="mt-20">
      <div>
        <div className={`flex justify-between ${props.widths} m-auto`}>
          <div className="flex space-x-3">
            <div className="rounded-full h-12 w-12 bg-[#DEE0E4]">
              <i className="fa-solid fa-user-group text-[25px] pl-2 pt-[10px] text-[#6E7E86]"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold">Team Documents</h1>
              <h3 className="text-sm">{props.teams}'s Teams</h3>
            </div>
          </div>
          <div className="flex items-center space-x-5">
            <button className="h-[40px] w-[121px] text-[#A8B0B7] rounded border-[#A8B0B7]  border-[1px] ">
              New Batch
            </button>
            <button className="h-[45px] w-[160px] text-white rounded  bg-primary">
              New Script
            </button>
          </div>
        </div>
        <div className="mt-14">
          <hr class={`h-px my-8 bg-[#D5D7DA] border-0 dark:bg-gray-900 ${props.widths} m-auto`} />
        </div>
        <div className={`${props.widths} m-auto flex flex-wrap gap-[40px] `}>
          <div className="bg-white w-[230px] h-[120px] rounded-[10px]">
            <div className="bg-gradient-to-r from-primary to-[#226576] w-[230px] h-[36px] rounded-t-lg text-end pt-px">
              <span class="material-symbols-outlined text-white cursor-pointer text-2xl pr-1">more_vert</span>
            </div>
          </div>
          <div className="bg-white w-[230px] h-[120px] rounded-[10px]">
            <div className="bg-gradient-to-r from-primary to-[#226576] w-[230px] h-[36px] rounded-t-lg text-end pt-px">
              <span class="material-symbols-outlined text-white cursor-pointer text-2xl pr-1">more_vert</span>
            </div>
          </div>
          <div className="bg-white w-[230px] h-[120px] rounded-[10px]">
            <div className="bg-gradient-to-r from-primary to-[#226576] w-[230px] h-[36px] rounded-t-lg text-end pt-px">
              <span class="material-symbols-outlined text-white cursor-pointer text-2xl pr-1">more_vert</span>
            </div>
          </div>
          <div className="bg-white w-[230px] h-[120px] rounded-[10px]">
            <div className="bg-gradient-to-r from-primary to-[#226576] w-[230px] h-[36px] rounded-t-lg text-end pt-px">
              <span class="material-symbols-outlined text-white cursor-pointer text-2xl pr-1">more_vert</span>
            </div>
          </div>
          <div className="bg-white w-[230px] h-[120px] rounded-[10px]">
            <div className="bg-gradient-to-r from-primary to-[#226576] w-[230px] h-[36px] rounded-t-lg text-end pt-px">
              <span class="material-symbols-outlined text-white cursor-pointer text-2xl pr-1">more_vert</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
