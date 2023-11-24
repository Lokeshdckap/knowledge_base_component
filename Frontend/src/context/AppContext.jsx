import React, { createContext, useContext, useState } from "react";
import axiosClient from "../axios-client";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const AppContext = createContext();

const MyContextProvider = ({ children }) => {
  const params = useParams();

  const [moveState,setMoveState] = useState(true);
  const [teamName, setTeam] = useState([]);
  const [allTeam, setAllTeam] = useState([]);
  const [batch, setBatch] = useState([]);
  const [script, setScript] = useState([]);
  const [overState, setOverState] = useState(null);
  const [childScript, setChildScript] = useState([]);
  const [loading, setLoading] = useState(false);
  //Adding State
  const [AddNewMenu, setAddNewMenu] = useState(false);
  const [popUp, setPopup] = useState(null);
  const [scriptCount, setScriptCount] = useState([]);
  const [scripts, setScripts] = useState(null);
  const [batchTitle, setBatchTitle] = useState("");
  const [batchDescription, setbatchDescription] = useState("");

  const duration = 2000;
  const showToastMessage = (data) => {
    toast.success(data, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: duration,
      hideProgressBar: true,
      draggable: true,
      closeOnClick: true,
    });
  };


  //move method
  const handleMove = () => {
    setMoveState((prevState) => !prevState)
    

  }
  //Team functions
  const getTeam = async () => {
    await axiosClient
      .get(`/getTeam/${params.uuid}`)
      .then((res) => {
        setTeam(res.data.name);
        getBatch();
        getScript();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllTeam = async () => {
    await axiosClient
      .get(`/getAllTeam`)
      .then((res) => {
        setAllTeam(res.data.getAllTeam);
      })
      .catch((err) => {});
  };

  const getBatch = async () => {
    await axiosClient
      .get(`/getBatch/${params.uuid}`)
      .then((res) => {
        setBatch(res.data.batchs);
        setScriptCount(res.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getScript = async () => {
    await axiosClient
      .get(`/getScript/${params.uuid}`)
      .then((res) => {
        setScript(res.data.script);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getScripts = async () => {
    await axiosClient
      .get(`/getScripts/${params.uuid}/${params.slug}`)
      .then((res) => {
        setOverState(res.data.script_batch.batch_uuid);
        setChildScript(res.data.result);
      });
  };

  const addNewBatch = () => {
    setLoading(true);
    axiosClient
      .post("/addNewBatch", { uuid: params.uuid })
      .then((res) => {
        if (res.status == 200) {
          getBatch();
          setLoading(false);
          setAddNewMenu(false);
          setPopup(null);
          showToastMessage("New Batch added successfully");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addNewScript = (e) => {
    let batch_uuid = e.target.id ? e.target.id : params.slug;

    setLoading(true);
    axiosClient
      .post("/addNewScript", { uuid: params.uuid, batch_uuid: batch_uuid })
      .then((res) => {
        setLoading(false);
        getScript();
        if (batch_uuid) {
          handleAfterAddedChildrenScripts(batch_uuid);
        }
        setAddNewMenu(false);
        setPopup(null);
        showToastMessage("New Script added successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAfterAddedChildrenScripts = async (uuid) => {
    let batch_uuid = uuid;
    await axiosClient
      .get(`/getBatchAndScripts/${params.uuid}/${batch_uuid}`)
      .then((res) => {
        setChildScript(res.data.result);
        setScripts(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getLoadScript = async (team_uuid, batch_uuid) => {
    await axiosClient
      .get(`/getBatchAndScripts/${team_uuid}/${batch_uuid}`)
      .then((res) => {
        setBatchTitle(res.data.result[0].batch.title);
        setbatchDescription(res.data.result[0].batch.description);
        setScripts(res.data.result);
        setChildScript(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (

    <AppContext.Provider
      value={{
        handleMove,
        moveState,
        batch,
        getBatch,
        getScript,
        script,
        getScripts,
        setOverState,
        setChildScript,
        overState,
        childScript,
        addNewBatch,
        setLoading,
        loading,
        setAddNewMenu,
        AddNewMenu,
        setPopup,
        popUp,
        showToastMessage,
        setScriptCount,
        scriptCount,
        addNewScript,
        getLoadScript,
        setScripts,
        batchTitle,
        setBatchTitle,
        batchDescription,
        setbatchDescription,
        scripts,
        getTeam,
        getAllTeam,
        teamName, 
        setTeam,
        allTeam,
         setAllTeam
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
const useMyContext = () => {
  return useContext(AppContext);
};

export { MyContextProvider, useMyContext };
