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
      .post("/addBatchTitleAndDescription", payLoad)
      .then((res) => {
        getScripts();
        getBatch();
        showToastMessage(res.data.message);
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
      .post("/addBatchTitleAndDescription", payLoad)
      .then((res) => {
        showToastMessage(res.data.message);
        getScripts();
        getBatch();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleTitleAndDescription = async (e) => {
    if (e.target.name == "title") {
      setBatchTitle(e.target.value);
    } else {
      setbatchDescription(e.target.value);
    }
  };

  return (
    <div className="bg-[#F9FAFB] h-screen w-screen overflow-auto z-[10px]">
      <BatchHeader
        widths={state ? "w-[1000px]" : "w-[1160px]"}
        batchTitle={batchTitle}
      />
      <BatchLayouts
        widths={state ? "w-[1010px]" : "w-[1120px]"}
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
      />

      {loading && (
        <>
          <div className="bg-primary opacity-[0.5] w-[1289px] h-[664px] absolute top-0 left-0  z-10"></div>
          <p className="absolute top-72 left-[600px] z-40">
            <HashLoader color="#3197e8" />
          </p>
        </>
      )}
    </div>
  );
};
