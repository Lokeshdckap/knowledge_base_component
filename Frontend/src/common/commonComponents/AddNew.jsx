import React, { useState } from "react";
import axiosClient from "../../axios-client";

export default function AddNew(props) {
    // console.log(props.team.uuid);
  const teamId = {"uuid" :props.team.uuid};

  const addNewBatch = (e) => {
    axiosClient.post("/addNewBatch", teamId)
      .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

  };

  return (
    <div>
      <div className="box-border bg-white h-28 w-56 p-4 border-[1px] rounded shadow-lg">
        <p className="text-lg mb-2 pl-2" id="script"><i className="fa-regular fa-file pr-2 ml-6"></i>New Script</p>
        <hr className={`h-px  bg-[#D5D7DA] border-0 dark:bg-gray-900 `} />
        <p className="text-lg mt-2 pl-2" id="batch" onClick={addNewBatch}><i className="fa-regular fa-file pr-2 ml-6"></i>New Batch</p>
      </div>
    </div>
  );
}
