import React from "react";
import deletes from "../../assets/images/delete.png";
import HashLoader from "react-spinners/HashLoader";

export const TrashMain = (props) => {
  return (
    <div className="mt-3 h-[500px] overflow-auto">
      <p className="text-2xl font-semibold text-red-500  ml-5 mb-2 ">
        {props.trashData ? (
          props.trashData.length > 0 ? (
            // Render if there are items in the trash
            <div>Trash Items</div>
          ) : (
            // Render if the trash is empty
            <div>Empty Trash</div>
          )
        ) : (
          // Render if trashData is undefined or null
          <div>Loading or No Data</div>
        )}
      </p>
      <div className="m-auto flex flex-wrap gap-[30px] w-[1020px] ">
        {props.trashData ? (
          props.trashData.length > 0 ? (
            props.trashData.map((trashScript) => (
            
              <div
                key={trashScript.uuid}
                className="bg-white w-[230px] h-[120px] rounded-[10px]"
              >
                <div className="bg-gradient-to-r from-primary to-[#226576] w-[230px] h-[36px] rounded-t-lg text-end pt-px">
                  <span className="material-symbols-outlined text-white cursor-pointer text-2xl pr-1">
                    more_vert
                  </span>
                </div>
                <div className="pl-5 pt-5 cursor-pointer">
                  <p>{trashScript.title}</p>
                  <p className="text-gray-500 text-sm pt-2">{trashScript.deleted_at}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="ml-56">
              <img className="h-[400px] w-[400px] " src={deletes} alt="" />
            </div>
          )
        ) : (
          <div>
              <p className="absolute top-72 left-[600px] z-40">
                <HashLoader color="#3197e8" />
              </p>
          </div>
        )}
      </div>
    </div>
  );
};
