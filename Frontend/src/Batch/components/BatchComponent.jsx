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
    setBatch,
    getBatch,
    addNewScript,
    childScript,
    setChildScript,
    getLoadScript,
    setScripts,
    batchTitle,
    setBatchTitle,
    batchDescription,
    setbatchDescription,
    scripts,
    showToastMessage,
  } = useMyContext();
  //hooks

  //state
  const [formValues, setFormValues] = useState({});
  const [errors, setError] = useState({});
  const [teamPopup, setTeamPopup] = useState(false);
  const [state, setState] = useState(true);
  const [data, setData] = useState(null);

  const [invitePopup, setInvitePopup] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(false);

  const [inviteError, setInviteError] = useState(null);

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
        getScripts();
        getBatch();
        showToastMessage(res.data.message);
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

  const handleCancel = () => {
    setTeamPopup(false);
  };

  const handleCreate = () => {
    setTeamPopup(true);
  };

  const HandleChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target.value);
    setFormValues({ ...formValues, [name]: value });
    delete errors[name];
  };

  const handleInviteUsers = () => {
    setLoading(true);
    console.log(inviteEmail);
    if (!inviteEmail.trim()) {
      setLoading(false);

      setInviteError("Email is required");
    } else if (!role.trim()) {
      setLoading(false);

      setInviteError("Role is required");
    } else {
      axiosClient
        .post("/inviteUsers", {
          email: inviteEmail,
          role: role,
          team_uuid: params.uuid,
        })
        .then((res) => {
          showToastMessage(res.data);
          setLoading(false);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 400) {
            setInviteError(response.data);
            setTimeout(() => {
              setInviteError("");
            }, 1500);
            setLoading(false);
          } else {
            console.error("Error:", response.status);
          }
        });
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

      <ToastContainer />

      {loading && (
        <p className="absolute top-72 left-[600px] z-40">
          <HashLoader color="#3197e8" />
        </p>
      )}
    </div>
  );
};
