import React from 'react'

export const BatchHeader = (props) => {
  return (
    <div className={`flex justify-between items-center ${props.widths} m-auto mt-[18px]`}>
        <div>
           {props.batchTitle}

        </div>
         {/* <button
            type="button"
            className="text-textPrimary border-[1px] border-gray-400 font-medium rounded-lg text-sm h-9 w-24 mr-2 mb-2 "
          >
            Share
          </button> */}


    </div>
  )
}
