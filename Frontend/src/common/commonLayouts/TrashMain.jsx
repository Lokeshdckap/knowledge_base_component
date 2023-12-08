import React, { useEffect, useRef, useState } from "react";
import deletes from "../../assets/images/delete.png";
import HashLoader from "react-spinners/HashLoader";
import { Checkbox } from 'antd';

export const TrashMain = (props) => {
  const [deleteState, setDeleteState] = useState(null);
  const deleteIconRef = useRef({});
  const deleteRef = useRef(null);

  const deleteForeverPopup = (e) => {
    setDeleteState(e.target.id);

  };

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (deleteRef.current !== null) {
        if (
          deleteState &&
          !deleteRef.current.contains(e.target) &&
          !Object.values(deleteIconRef.current).includes(e.target)
        ) {
          setDeleteState(null);
        }
      }
    };

    window.addEventListener("click", closeOnOutsideClick);
    return () => {
      window.removeEventListener("click", closeOnOutsideClick);
    };

  }, [deleteState]);


  return (
    <div className="mt-3 h-[500px] overflow-auto">
      <div className="text-2xl  text-textPrimary  ml-6 mb-5 mt-3">
        {props.trashData ? (
          props.trashData.length > 0 ? (
            // Render if there are items in the trash
            <div>Save things or waste, it's your choice ?</div>
          ) : (
            // Render if the trash is empty
            <div>Empty Trash</div>
          )
        ) : (
          // Render if trashData is undefined or null
          <div>Loading or No Data</div>
        )}
      </div>

      <div className="m-auto flex flex-wrap gap-[30px] w-[1020px] ">
        {props.trashData ? (
          props.trashData.length > 0 ? (
            props.trashData.map((trashScript) => (
              <div
                key={trashScript.uuid}
                className={`bg-white w-[230px] h-[120px] relative rounded-[10px] shadow-lg hover:scale-105 ${
                  props.styleState &&
                  props.styleState.includes(trashScript.uuid) &&
                  "scale-105"
                }`}
                id={trashScript.uuid}
              >
                <div
                  className="bg-gradient-to-r from-primary to-[#226576] w-[230px] h-[36px] rounded-t-lg flex items-center justify-between  "
                  id={trashScript.uuid}
                >
                   <Checkbox onChange={props.handleSelect} id={trashScript.uuid}  className="ml-2"></Checkbox>
                  <span
                    className="material-symbols-outlined text-white cursor-pointer text-2xl pr-1"
                    onClick={deleteForeverPopup}
                    ref={(ref) =>
                      (deleteIconRef.current[trashScript.uuid] = ref)
                    }
                    id={trashScript.uuid}
                  >
                    more_vert
                  </span>
                </div>
                <div
                  className="pl-5 pt-5 cursor-pointer"
                  id={trashScript.uuid}
                >
                  <p id={trashScript.uuid} >
                    {trashScript.title}
                  </p>
                  <p className="text-gray-500" id={trashScript.uuid}>
                    {trashScript.deleted_at}
                  </p>
                </div>
                {deleteState == trashScript.uuid && (
                  <div
                    className="bg-white shadow-lg h-[70px] w-32 absolute top-8 z-10 right-[-10px] rounded-lg"
                    ref={deleteRef}
                  >
                    <p
                      className="cursor-pointer pt-1.5 pl-3.5 pb-1 hover:bg-primary text-textPrimary hover:text-white hover:rounded-t-lg"
                      id={trashScript.uuid}
                      onClick={props.handleParticularDelete}
                    >
                      Delete forever
                    </p>
                    <hr />
                    <p
                      className="cursor-pointer pt-0.5 pl-3.5 pb-2 hover:bg-primary text-textPrimary hover:text-white hover:rounded-b-lg"
                      id={trashScript.uuid}
                      onClick={props.handleParticularRestore}
                    >
                      Restore
                    </p>
                  </div>
                )}
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