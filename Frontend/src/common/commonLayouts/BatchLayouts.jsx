import React from 'react'

export const BatchLayouts = (props) => {
  return (
    <div className="pt-16 h-[550px] overflow-auto z-0">
      <div className="h-[550px] ">
        <div className={`flex justify-between ${props.widths} m-auto  `}>
        <div>
            
              <input className="text-2xl ml-[80px] mt-8 focus:outline-none text-textPrimary bg-slate-300  font-bold" placeholder="Batch Name"/>
              <input className="text-xl ml-[80px] mt-5 focus:outline-none text-textPrimary " placeholder="Batch Description"/>

          </div>
         
          <div className="flex items-center space-x-5">
            <button className="h-[40px] w-[121px] text-[#A8B0B7] rounded border-[#A8B0B7]  border-[1px] " >
              New Batch
            </button>
            <button className="h-[45px] w-[160px] text-white rounded  bg-primary" >
              New Script
            </button>
          </div>
        </div>
        <div className="mt-14">
          <hr
            class={`h-px my-8 bg-[#D5D7DA] border-0 dark:bg-gray-900 ${props.widths} m-auto`}
          />
        </div>
        </div>
</div>
  )
}
