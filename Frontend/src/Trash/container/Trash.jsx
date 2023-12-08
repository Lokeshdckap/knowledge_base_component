import React, { useEffect, useState } from "react";
import { TrashComponent } from "../component/TrashComponent";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useMyContext } from "../../context/AppContext";

export const Trash = () => {

  const {
    getAllDeletedData,
    trashData, 
    setTrashData

  } = useMyContext();
 
  const params = useParams();

  const [deletePopup, setDeletePopup] = useState(false);
  // const [trashData, setTrashData] = useState([]);
  const [styleState, setStyleState] = useState([]);

  useEffect(() => {
    getAllDeletedData();
  }, [params.slug]);

  const { showToastMessage, getScript } = useMyContext();

  const deleteAllPopup = () => {
    setDeletePopup((prevState) => !prevState);
  };

  const handleDelete = async () => {

    if (styleState.length > 0) {
      await axiosClient
        .delete(`/api/trash/selectedTrash/${params.uuid}`, {
          data: styleState,
        })
        .then((res) => {
          if (res.status == 200) {
            getAllDeletedData();
            deleteAllPopup();
            showToastMessage(res.data.message);
            setStyleState([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await axiosClient
        .delete(`/api/trash/permanentDeleteAll/${params.uuid}`)
        .then((res) => {
          if (res.status == 200) {
            getAllDeletedData();
            deleteAllPopup();
            showToastMessage(res.data.success);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  // const getAllDeletedData = () => {
  //   axiosClient
  //     .get(`/getAllTrash/${params.uuid}`)
  //     .then((res) => {
  //       setTrashData(res.data.itemsWithDaysLeft);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const handleParticularDelete = async (e) => {
    if (e.target.id) {
      await axiosClient
        .delete(`/api/trash/permanentDelete/${params.uuid}/${e.target.id}`)
        .then((res) => {
          getAllDeletedData();
          showToastMessage(res.data.message);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleParticularRestore = async (e) => {
    if (e.target.id) {
      console.log(e.target.id);
      await axiosClient
        .put(`/api/trash/restore/${params.uuid}/${e.target.id}`)
        .then((res) => {
          getAllDeletedData();
          showToastMessage(res.data.message);
          getScript();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSelect = (e) => {
    const { id } = e.target;

    // Check if the ID is already in the state
    const isSelected = styleState.includes(id);

    // If it's selected, remove it; otherwise, add it to the state
    if (isSelected) {
      setStyleState(styleState.filter((selectedId) => selectedId !== id));
    } else {
      setStyleState([...styleState, id]);
    }
  };
  return (
    <>
      <TrashComponent
        trashData={trashData}
        setDeletePopup={setDeletePopup}
        deletePopup={deletePopup}
        deleteAllPopup={deleteAllPopup}
        handleDelete={handleDelete}
        handleParticularDelete={handleParticularDelete}
        handleParticularRestore={handleParticularRestore}
        handleSelect={handleSelect}
        styleState={styleState}
        setStyleState={setStyleState}
      />
    </>
  );
};
