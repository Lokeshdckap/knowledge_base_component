import React, { useEffect, useRef, useState } from "react";
import deletes from "../../assets/images/delete.png";
import HashLoader from "react-spinners/HashLoader";
import { Checkbox } from "antd";
import { formatDistanceToNow } from "date-fns";
import { RestoreConfirmation } from "../commonComponents/RestoreConfirmation";
import moment from "moment";
import { Info } from "../commonComponents/Info";

import file from "../../assets/images/files.png";
import folder from "../../assets/images/folderKb.png";
import { DeleteConfirmation } from "../commonComponents/DeleteConfirmation";

export const TrashMain = (props) => {
  const [deleteState, setDeleteState] = useState(null);
  const [trashInfo, setTrashInfo] = useState(null);

  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const deleteIconRef = useRef({});
  const infoIconRef = useRef({});
  const deleteRef = useRef(null);
  const infoRef = useRef(null);

  const deleteForeverPopup = (e) => {
    setDeleteState(e.target.id);
  };

  const handleTrashInfo = (e) => {
    setTrashInfo(e.target.id);
    props.handleTrashInfo(e.target.id);
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

      if (infoRef.current !== null) {
        if (
          trashInfo &&
          !infoRef.current.contains(e.target) &&
          !Object.values(infoIconRef.current).includes(e.target)
        ) {
          setTrashInfo(null);
        }
      }
    };
    const updateScreenHeight = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener("click", closeOnOutsideClick);
    window.addEventListener("resize", updateScreenHeight);

    return () => {
      window.removeEventListener("click", closeOnOutsideClick);
      window.removeEventListener("resize", updateScreenHeight);
    };
  }, [deleteState, trashInfo]);

  const deleteAllPopup = () => {
    props.setHandleDeleteConfirmation((prevState) => !prevState);
  };

  // handleRestoreConfirmation={props.handleRestoreConfirmation}
  // setHandleRestoreConfirmation={props.setHandleRestoreConfirmation}

  return (
    <div
      className="bg-[#F4F7FC] h-[500px] overflow-auto pl-[30px] pr-[30px]"
      style={{ height: `calc(${screenHeight}px - 64px)` }}
    >
      <div className="text-2xl phone:text-[16px] text-textPrimary pt-3 pb-3">
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
      {props.trashData ? (
        props.trashData.length > 0 ? (
          <div className="m-auto grid 2xl:grid-cols-5 xl:grid-cols-4 lg:grid-cols-3 phone:grid-cols-2 gap-4 mt-8">
            {props.trashData.map((trashScript) => (
              <div
                key={trashScript.uuid}
                className={`bg-white border-[1px] rounded-[10px] hover:border-primary relative lg:p-[5px] xl:p-[10px] 2xl:p-[20px] ${
                  props.styleState &&
                  props.styleState.includes(trashScript.uuid)
                    ? "scale-105"
                    : ""
                }`}
                id={trashScript.uuid}
              >
                <div className="w-[100%] phone:p-[5px]">
                  <div
                    className="rounded-t-lg flex items-center justify-between"
                    id={trashScript.uuid}
                  >
                    {props.role === 2 ? (
                      ""
                    ) : (
                      <>
                        <Checkbox
                          onChange={props.handleSelect}
                          id={trashScript.uuid}
                          className="ml-2"
                        ></Checkbox>
                        <div className="flex items-center space-x-3">
                          {!Object.keys(trashScript).includes("batch_uuid") && (
                            <i
                              className="fa-solid fa-circle-info text-primary cursor-pointer text-lg"
                              id={trashScript.uuid}
                              onClick={handleTrashInfo}
                              ref={(ref) =>
                                (infoIconRef.current[trashScript.uuid] = ref)
                              }
                            ></i>
                          )}
                          <span
                            className="material-symbols-outlined text-primary cursor-pointer text-2xl phone:text-[14px] leading-[6px]"
                            onClick={deleteForeverPopup}
                            ref={(ref) =>
                              (deleteIconRef.current[trashScript.uuid] = ref)
                            }
                            id={trashScript.uuid}
                          >
                            more_vert
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div
                    className="font-medium cursor-pointer ml-2"
                    id={trashScript.uuid}
                  >
                    <div className="flex items-center space-x-2">
                      {Object.keys(trashScript).includes("batch_uuid") ? (
                        <img src={file} alt="" className="w-[17px] h-[18px]" />
                      ) : (
                        <img
                          src={folder}
                          alt=""
                          className="w-[17px] h-[18px]"
                        />
                      )}

                      <p id={trashScript.uuid}>{trashScript.title}</p>
                    </div>

                    {trashScript.batch && (
                      <p id={trashScript.uuid}>
                        Parent Folder : {trashScript.batch}
                      </p>
                    )}
                    <p className="text-gray-500 pt-1" id={trashScript.uuid}>
                      {"7days Left"}
                    </p>
                  </div>
                </div>
                {deleteState === trashScript.uuid && (
                  <div
                    className="bg-white shadow-lg h-[70px] w-32 absolute top-8 z-10 right-[-10px] rounded-lg"
                    ref={deleteRef}
                  >
                    <p
                      className="cursor-pointer pt-1.5 pl-3.5 pb-1 hover:bg-primary text-textPrimary hover:text-white hover:rounded-t-lg"
                      id={trashScript.uuid}
                      onClick={
                        Object.keys(trashScript).includes("batch_uuid")
                          ? (e) => props.handleParticularDelete(e)
                          : (e) => props.setHandleDeleteConfirmation(e)
                      }
                    >
                      Delete forever
                    </p>
                    <hr />
                    <p
                      className="cursor-pointer pt-0.5 pl-3.5 pb-2 hover:bg-primary text-textPrimary hover:text-white hover:rounded-b-lg"
                      id={trashScript.uuid}
                      onClick={
                        Object.keys(trashScript).includes("batch_uuid")
                          ? (e) => props.handleParticularRestore(e)
                          : (e) => props.setHandleRestoreConfirmation(e)
                      }
                    >
                      Restore
                    </p>
                  </div>
                )}

                {trashScript.uuid == trashInfo && (
                  <>
                    <Info
                      trashInfoDetails={props.trashInfoDetails}
                      infoRef={infoRef}
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="">
            <img className="w-[400px] m-auto" src={deletes} alt="" />
          </div>
        )
      ) : (
        <></>
      )}
      {props.handleDeleteConfirmation && (
        <>
          <DeleteConfirmation
            deleteAllPopup={deleteAllPopup}
            check={props.handleDeleteConfirmation}
            handleParticularDelete={props.handleParticularDelete}
          />
        </>
      )}
      {props.handleRestoreConfirmation && (
        <>
          <RestoreConfirmation
            setHandleRestoreConfirmation={props.setHandleRestoreConfirmation}
          />
        </>
      )}
    </div>
  );
};
