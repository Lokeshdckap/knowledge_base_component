import React from "react";

export default function EditHeader(props) {
  return (
    <div className="">
      <div
        className={`flex items-center justify-between m-auto ${props.widths} mt-3 space-y-2`}
      >
        <div className="box-border bg-[#EEEEEE] h-11 w-72 pl-2 pt-1 border-[1px] rounded">
          <h2 className="text-primary font-bold text-2xl">Untitle Content</h2>
        </div>
        <div >
          <button
            type="button"
            class="text-white bg-primary hover:bg-primary   font-medium rounded-lg text-sm h-9 w-20 mr-2 mb-2  focus:outline-none "
          >
            Copy
          </button>
          <button
            type="button"
            class="text-white bg-primary hover:bg-primary   font-medium rounded-lg text-sm h-9 w-24 mr-2 mb-2  focus:outline-none "
            onClick={props.clickPublish}
          >
            Publish
          </button>
          <button
            type="button"
            class="text-textPrimary border-[1px] border-gray-400 font-medium rounded-lg text-sm h-9 w-24 mr-2 mb-2 "
          >
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
