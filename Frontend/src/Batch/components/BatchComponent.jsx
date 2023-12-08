import React, { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { useNavigate, useParams } from "react-router-dom";
import { BatchHeader } from "../../common/commonLayouts/BatchHeader";
import { BatchLayouts } from "../../common/commonLayouts/BatchLayouts";
import { ToastContainer, toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import { useMyContext } from "../../context/AppContext";

export const BatchComponent = () => {
  const navigate = useNavigate();
  const params = useParams();
  const {
    batch,
    getBatch,
    addNewScript,
    getLoadScript,
    batchTitle,
    setBatchTitle,
    batchDescription,
    setbatchDescription,
    handleAfterAddedChildrenScripts,
    scripts,
    showToastMessage,
  } = useMyContext();
  //hooks

  //state
  const [state, setState] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
 
    getScripts();
  }, [params.slug]);

  const getScripts = async () => {
    let team_uuid = params.uuid;
    let batch_uuid = params.slug;

    getLoadScript(team_uuid, batch_uuid);
  };

  const handleBatchBlur = async () => {
    let payLoad = {
      batch_uuid: params.slug,
      title: batchTitle,
    };
    await axiosClient
      .post("/api/batch/addBatchTitleAndDescription", payLoad)
      .then((res) => {
        getScripts();
        getBatch();
      
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDescriptionBlur = async () => {
    let payLoad = {
      batch_uuid: params.slug,
      description: batchDescription,
    };
    await axiosClient
      .post("/api/batch/addBatchTitleAndDescription", payLoad)
      .then((res) => {

        getScripts();
        getBatch();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTrash = (e) => {
    let targetId = e.target.id;

    if (targetId) {
      setLoading(true);
      axiosClient
        .put(`/api/trash/moveToTrash/${params.uuid}/${targetId}`)
        .then((res) => {
          if (res.status == 200) {
            setLoading(false);
            // getBatch();
            getScripts();
          }
        })
        .catch((err) => {
          const response = err.response;
          console.log(response);
          if (response && response.status === 400) {
          } else {
            console.error("Error:", response.status);
          }
        });
    }
  };

  const handleTitleAndDescription = async (e) => {
    if (e.target.name == "title") {
      setBatchTitle(e.target.value);
    } else {
      setbatchDescription(e.target.value);
    }
  };

  return (
    <>
      <BatchHeader batchTitle={batchTitle} />

      <BatchLayouts
        AddScript={addNewScript}
        scripts={scripts}
        batchTitle={batchTitle}
        setBatchTitle={setBatchTitle}
        batchDescription={batchDescription}
        setbatchDescription={setbatchDescription}
        changeEvent={handleTitleAndDescription}
        batch={batch}
        handleBlur={handleBatchBlur}
        handleDescriptionBlur={handleDescriptionBlur}
        handleTrash={handleTrash}
      />
      

    </>
  );
};
