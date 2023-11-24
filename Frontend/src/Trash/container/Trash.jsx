import React, { useEffect, useState } from "react";
import { TrashComponent } from "../component/TrashComponent";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios-client";

export const Trash = () => {
  const params = useParams();

  const [trashData,setTrashData] = useState([]);
  useEffect(() => {
    getAllDeletedData();
  }, [params.slug]);

  const getAllDeletedData = () => {
    axiosClient
      .get(`/getAllTrash/${params.uuid}`)
      .then((res) => {
          setTrashData(res.data.allTrashScript);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <TrashComponent
      trashData={trashData}
      />
    </>
  );
};
