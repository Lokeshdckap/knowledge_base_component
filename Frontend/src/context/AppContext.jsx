import React, { createContext, useContext, useState } from "react";
import axiosClient from "../axios-client";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const AppContext = createContext();

const MyContextProvider = ({ children }) => {
  const params = useParams();
  const navigate = useNavigate();

  const [moveState, setMoveState] = useState(true);
  const [teamName, setTeam] = useState([]);
  const [allTeam, setAllTeam] = useState([]);
  const [batch, setBatch] = useState([]);
  const [script, setScript] = useState([]);
  const [overState, setOverState] = useState(null);
  const [childScript, setChildScript] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trashData, setTrashData] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);

  //style State
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  //Adding State
  const [AddNewMenu, setAddNewMenu] = useState(false);
  const [popUp, setPopup] = useState(null);
  const [scriptCount, setScriptCount] = useState([]);
  const [scripts, setScripts] = useState(null);
  const [batchTitle, setBatchTitle] = useState("");
  const [batchDescription, setbatchDescription] = useState("");
  const [userDetail, setUserDetail] = useState(null);

  const [openSideNave, setOpenSideNave] = useState("hidden");
  const [role, setRole] = useState(null);

  function handleUserActivity() {}

  document.addEventListener("mousemove", handleUserActivity);
  document.addEventListener("keydown", handleUserActivity);

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

  const showToastErrorMessage = (data) => {
    toast.error(data, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: duration,
      hideProgressBar: true,
      draggable: true,
      closeOnClick: true,
      closeButton: () => (
        <div style={{ margin: "auto", fontSize: "22px" }}>
          <button className="custom-close-button">×</button>
        </div>
      ),
      style: {
        borderRadius: "8px",
        padding: "10px",
      },
    });
  };

  //move method
  const handleMove = () => {
    setMoveState((prevState) => !prevState);
  };
  //Team functions
  const getTeam = async () => {
    setLoading(true);
    if (params.uuid) {
      await axiosClient
        .get(`/api/teams/getTeam/${params.uuid}`)
        .then((res) => {
          setLoading(false);
          setRole(res.data.team_member.role_id);
          setTeam(res.data.Teams[0].name);
          getBatch();
          getScript();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response?.status === 404) {
            navigate("/error");
          }
          console.log(err);
          setLoading(false);
        });
    }
  };
  const getAllTeam = async () => {
    await axiosClient
      .get(`/api/teams/getAllTeam`)
      .then((res) => {
        if (
          res.data.getAllTeam.length > 0 &&
          localStorage.getItem("ACCESS_TOKEN")
        ) {
          setAllTeam(res.data.getAllTeam);
          getTeam();
          userInfo();
        } else if (localStorage.getItem("ACCESS_TOKEN")) {
          navigate("/teampage");
        }
      })
      .catch((err) => {
        const response = err.response;
        if (response && response?.status === 401) {
          window.location.reload("/signin");
        }
      });
  };

  const getBatch = async () => {
    await axiosClient
      .get(`/api/batch/getBatch/${params.uuid}`)
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
      .get(`/api/scripts/getScript/${params.uuid}`)
      .then((res) => {
        setScript(res.data.script);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getScripts = async () => {
    await axiosClient
      .get(`/api/dashboard/getScripts/${params.uuid}/${params.slug}`)
      .then((res) => {
        setChildScript(res.data.result);
      });
  };

  const addNewBatch = () => {
    setLoading(true);
    axiosClient
      .post("/api/batch/addNewBatch", { uuid: params.uuid })
      .then((res) => {
        if (res.status == 200) {
          getBatch();
          setLoading(false);
          setAddNewMenu(false);
          setPopup(null);
          showToastMessage(res.data.Success);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addNewScript = (e) => {
    let batch_uuid = e.target.id ? e.target.id : null;
    setLoading(true);
    axiosClient
      .post("/api/scripts/addNewScript", {
        uuid: params.uuid,
        batch_uuid: batch_uuid,
      })
      .then((res) => {
        setLoading(false);
        getScript();
        getBatch();
        if (batch_uuid) {
          handleAfterAddedChildrenScripts(batch_uuid);
        }
        setAddNewMenu(false);
        setPopup(null);
        showToastMessage(res.data.Success);
        if (localStorage.getItem("mainId")) {
          localStorage.removeItem("mainId");
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const addNewChildScript = () => {
    let batch_uuid = params.slug;
    setLoading(true);
    axiosClient
      .post("/api/scripts/addNewScript", {
        uuid: params.uuid,
        batch_uuid: batch_uuid,
      })
      .then((res) => {
        setLoading(false);
        getScript();
        getBatch();
        if (batch_uuid) {
          handleAfterAddedChildrenScripts(batch_uuid);
        }
        setAddNewMenu(false);
        setPopup(null);
        showToastMessage(res.data.Success);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleAfterAddedChildrenScripts = async (uuid) => {
    let batch_uuid = uuid;
    await axiosClient
      .get(`/api/dashboard/getBatchAndScripts/${params.uuid}/${batch_uuid}`)
      .then((res) => {
        setChildScript(res.data.result);
        setScripts(res.data.result);
      })

      .catch((err) => {
        console.log(err);
      });
  };

  const getLoadScript = async (team_uuid, batch_uuid) => {
    setLoading(true);
    await axiosClient
      .get(`/api/dashboard/getBatchAndScripts/${team_uuid}/${batch_uuid}`)
      .then((res) => {
        setBatchTitle(res.data.batchData.title);
        setbatchDescription(res.data.batchData.description);
        setScripts(res.data.result);
        setChildScript(res.data.result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getChildScript = async (team_uuid, batch_uuid) => {
    await axiosClient
      .get(`/api/dashboard/getBatchAndScripts/${team_uuid}/${batch_uuid}`)
      .then((res) => {
        setChildScript(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Trash
  const handleTrash = (e) => {
    let targetId = e.target.id;
    let batchId = e.target.dataset.set;

    if (targetId) {
      setLoading(true);
      axiosClient
        .put(`/api/trash/moveToTrash/${params.uuid}/${targetId}`)
        .then((res) => {
          if (res.status == 200) {
            setLoading(false);
            showToastErrorMessage(res.data.message);
            getBatch();
            getScript();

            getAllDeletedData();
            if (localStorage.getItem("mainId")) {
              localStorage.removeItem("mainId");
            }
            if (batchId) {
              handleAfterAddedChildrenScripts(batchId);
            }
            let url = `/dashboard/${params.uuid}/t/trash`;
            console.log(url, window.location.pathname);
            if (url !== window.location.pathname) {
              navigate(`/dashboard/${params.uuid}`);
            }
          }
          getAllDeletedData();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 400) {
          } else {
            console.error("Error:", response.status);
          }
        });
    } else {
      showToastErrorMessage("Please Click the correct target");
    }
  };

  const getAllDeletedData = () => {
    setLoading(true);

    axiosClient
      .get(`/api/trash/getAllTrash/${params.uuid}`)
      .then((res) => {
        console.log(res);
        setLoading(false);
        setTrashData(res.data.allTrashses);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const userInfo = async () => {
    await axiosClient
      .get("/api/user/getUserInfo")
      .then((res) => {
        setUserDetail(res.data.userInfo);
      })
      .catch((err) => {
        const response = err.response;
        console.log(response);
      });
  };

  const handleLinkClick = (e) => {
    if (hasChanges) {
      const confirmed = window.confirm(
        "Are you sure want to Leave? you have unsaved changes"
      );
      if (confirmed) {
        setHasChanges(false);
        navigate(e.currentTarget.getAttribute("href"));
      } else {
        e.preventDefault();
        return false;
      }
    }
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
        setAllTeam,
        getChildScript,
        handleAfterAddedChildrenScripts,
        getAllDeletedData,
        trashData,
        setTrashData,
        handleTrash,
        userInfo,
        userDetail,
        screenHeight,
        setScreenHeight,
        openSideNave,
        setOpenSideNave,
        role,
        addNewChildScript,
        hasChanges,
        setHasChanges,
        handleLinkClick,

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
