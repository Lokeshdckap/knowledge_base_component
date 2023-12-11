import React from "react";
import { TrashHeader } from "../../common/commonLayouts/TrashHeader";
import { TrashMain } from "../../common/commonLayouts/TrashMain";


export const TrashComponent = (props) => {

  return (
    <>
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
      </>

  );
};
