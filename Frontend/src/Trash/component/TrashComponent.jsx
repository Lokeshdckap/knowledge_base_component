import React from "react";
import { TrashHeader } from "../../common/commonLayouts/TrashHeader";
import { TrashMain } from "../../common/commonLayouts/TrashMain";


export const TrashComponent = (props) => {
  {console.log(props.styleState)}
  return (
    <div className="bg-[#F9FAFB] h-screen w-screen overflow-auto z-[10px]">
      <TrashHeader
        setDeletePopup={props.setDeletePopup}
        deletePopup={props.deletePopup}
        deleteAllPopup={props.deleteAllPopup}
        handleDelete={props.handleDelete}
      />
      <TrashMain
        trashData={props.trashData}
        handleParticularDelete={props.handleParticularDelete}
        handleParticularRestore={props.handleParticularRestore}
        handleSelect={props.handleSelect}
        styleState={props.styleState}
        setStyleState={props.setStyleState}
        

      />
    </div>
  );
};
