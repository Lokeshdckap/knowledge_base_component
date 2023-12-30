import React from "react";
import { TrashHeader } from "../../common/commonLayouts/TrashHeader";
import { TrashMain } from "../../common/commonLayouts/TrashMain";
import HashLoader from "react-spinners/HashLoader";


export const TrashComponent = (props) => {
  return (
    <>
      <TrashHeader
        setDeletePopup={props.setDeletePopup}
        deletePopup={props.deletePopup}
        deleteAllPopup={props.deleteAllPopup}
        handleDelete={props.handleDelete}
        trashData={props.trashData}
        role={props.role}
      />
      <TrashMain
        trashData={props.trashData}
        trashBatchData={props.trashBatchData}
        handleParticularDelete={props.handleParticularDelete}
        handleParticularRestore={props.handleParticularRestore}
        handleSelect={props.handleSelect}
        styleState={props.styleState}
        setStyleState={props.setStyleState}
        role={props.role}
        restorePopup={props.restorePopup}
        setRestorePopup={props.setRestorePopup}

      />
      {props.loading && (
        <>
          <div className="bg-[#aeaeca] opacity-[0.5] w-[100%] h-[100vh] absolute top-0 left-0  z-10"></div>
          <div className="">
            <p className="absolute top-[48%] left-[48%] z-50 ">
              <HashLoader color="#3197e8" />
            </p>
          </div>
        </>
      )}
    </>
  );
};
