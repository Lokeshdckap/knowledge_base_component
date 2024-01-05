import React, { useEffect, useState } from "react";
import { TrashComponent } from "../component/TrashComponent";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useMyContext } from "../../context/AppContext";

export const Trash = () => {
  const {
    getAllDeletedData,
    trashData,
    getBatch,
    setTrashData,
    role,
    setTrashBatchData,
    trashBatchData,
  } = useMyContext();

  const params = useParams();

  const [deletePopup, setDeletePopup] = useState(false);
  const [styleState, setStyleState] = useState([]);
  const [loading, setLoading] = useState(false);
  const [restorePopup, setRestorePopup] = useState(false);
  const [trashInfoDetails, setTrashInfoDetails] = useState([]);
  const [handleDeleteConfirmation, setHandleDeleteConfirmation] =
    useState(false);
  const [handleRestoreConfirmation, setHandleRestoreConfirmation] =
    useState(false);

  useEffect(() => {
    getAllDeletedData();
  }, [params.slug]);

  const { showToastMessage, getScript } = useMyContext();

  const deleteAllPopup = () => {
    setDeletePopup((prevState) => !prevState);
  };

  const handleDelete = async () => {
    setLoading(true);

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
            setLoading(false);
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
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleParticularDelete = async (e) => {
    setLoading(true);
    if (e.target.id) {
      console.log(e.target.id, "checked");

      await axiosClient
        .delete(`/api/trash/permanentDelete/${params.uuid}/${e.target.id}`)
        .then((res) => {
          getAllDeletedData();
          showToastMessage(res.data.message);
          setLoading(false);

          setHandleDeleteConfirmation(null);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const handleParticularRestore = async (e) => {
    setLoading(true);

    if (e.target.id) {
      await axiosClient
        .put(`/api/trash/restore/${params.uuid}/${e.target.id}`)
        .then((res) => {
          getAllDeletedData();
          showToastMessage(res.data.message);
          getScript();
          getBatch();
          setLoading(false);
          setHandleRestoreConfirmation(null)
          if (!res.data.state) {
            setRestorePopup(true);
          }
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

  const handleTrashInfo = async (id) => {
    setLoading(true);

    await axiosClient
      .get(`/api/trash/getAllTrashScriptsForBatch/${params.uuid}/${id}`)
      .then((res) => {
        if (res.status == 200) {
          setTrashInfoDetails(res.data.allTrashScript);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
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
        loading={loading}
        role={role}
        trashBatchData={trashBatchData}
        restorePopup={restorePopup}
        setRestorePopup={setRestorePopup}
        handleTrashInfo={handleTrashInfo}
        trashInfoDetails={trashInfoDetails}
        handleDeleteConfirmation={handleDeleteConfirmation}
        setHandleDeleteConfirmation={setHandleDeleteConfirmation}
        handleRestoreConfirmation={handleRestoreConfirmation}
        setHandleRestoreConfirmation={setHandleRestoreConfirmation}
      />
    </>
  );
};
