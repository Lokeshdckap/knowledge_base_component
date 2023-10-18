import React from "react";

export default function EditHeader() {
  return (
    <div className="">
      <div className={`flex items-center justify-between m-auto  mt-4`}>
        <div className="box-border bg-white h-11 w-56 p-4 border-[1px] rounded">
          <h2>Untitle Content</h2>
        </div>
        <div>
            <button>Copy</button>
            <button>Publish</button>
            <button>Share</button>
        </div>
      </div>
    </div>
  );
}
