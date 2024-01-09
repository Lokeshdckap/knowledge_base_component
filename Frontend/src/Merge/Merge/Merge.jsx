import React, { useEffect, useState } from "react";
import { MergeComponents } from "../MergeComponents/MergeComponents";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useMyContext } from "../../context/AppContext";
import { ToastContainer, toast } from "react-toastify";

export const Merge = () => {

  const params = useParams();

  const navigate = useNavigate();

  const {
    getScript,
    script,
    getScripts,
    setLoading,
    role,
    hasChanges,
    setHasChanges,
  } = useMyContext();

  const [publish, setPublish] = useState([]);
  const [shareState, setShareState] = useState(false);
  const [renderScript, setRenderScript] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [pageContent, setPageContent] = useState(null);
  const [treeNode, setTreeNode] = useState([]);
  const [maintainPageCount, setMaintainPageCount] = useState(null);
  const [parentOpen, setParentOpen] = useState(null);


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageIds = queryParams.get("pageId");

  useEffect(() => {
    if (pageIds) {
      getParentOpen();
      getParticularPage();
      getParticularScript();
      getScripts();
    } else {
      getParticularScript();
      getScripts();
      getParticularOpenScript();
    }
  }, [params.slug, params, pageIds]);


  const handleChange = async (event) => {
    const inputValue = event;

    setInputValue(inputValue); // Update the state with the current value

    let paraId = params.slug;
    const encodedInputValue = inputValue;
    let payload = {
      inputValue: encodedInputValue,
      queryParameter: paraId,
      teamParameter: params.uuid,
    };
    await axiosClient
      .post("/api/scripts/addScriptTitle", payload)
      .then((res) => {
        getScripts();
        getScript();
      })
      .catch((err) => {
        const response = err.response;
        if (response && response?.status === 403) {
          showToastErrorMessage(response.data.errorMsg);
        } else {
          console.error("Error:", response?.status);
        }
      });

  };


  const getParticularPage = async () => {
    // setIsLoading(true);
    await axiosClient
      .get(`/api/pages/getPage/${pageIds}`)
      .then((res) => {
        // setParticularTitle(res.data.pages.title.split("-")[0]);
        // setDescription(res.data.pages.description);
        // setInputStr(res.data.pages.emoji);
        // setEditorValue(res.data.pages.content);
        // setEditorContent(res.data.pages.content);
        // setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        // setIsLoading(false);
      });
  };



  const getParticularOpenScript = async () => {
    let script_uuid = params.slug;

    await axiosClient
      .get(`/api/dashboard/getScriptAndPage/${script_uuid}`)
      .then((res) => {
        // navigate(
        //   `/dashboard/${params.uuid}/s/${params.slug}/?pageId=${res.data.hierarchy[0].uuid}`
        // );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getParentOpen = async () => {
    await axiosClient
      .get(`/api/dashboard/getOpenParent/${pageIds}`)
      .then((res) => {
        setParentOpen(res.data.parentPages);
      })
      .catch((err) => {
        console.log(err);
      });
  };








  const duration = 2000;


  const showToastSaveMessage = (data) => {
    toast.success(data, {
      position: toast.POSITION.TOP_CENTER,
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
    });
  };



  const HandleShare = () => {
    setShareState(true);
  };


  const getParticularScript = async () => {
    setLoading(true);
    let script_uuid = params.slug;
    await axiosClient
      .get(`/api/dashboard/getScriptAndPage/${script_uuid}`)
      .then((res) => {
        if (res.status == 200) {
          // if (res.data.getScriptAndPages.is_published) {
          //   navigate(`/dashboard/${params.uuid}/edit/${params.slug}`);
          // }
          setInputValue(res.data.getScriptAndPages.title);
          setPageContent(res.data.hierarchy[0]);
          setTreeNode(res.data.hierarchy);
          setRenderScript(res.data.getScriptAndPages);
          setPublish(res.data.getScriptAndPages);
          setMaintainPageCount(res.data.pageCount);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };




  return (
    <div>
      <MergeComponents
        changeEvent={handleChange}
        inputValue={inputValue}
        setInputValue={setInputValue}
        renderScript={renderScript}
        HandleShare={HandleShare}
        publish={publish}
        role={role}
        getParticularScript={getParticularScript}
      />
    </div>
  );
};
