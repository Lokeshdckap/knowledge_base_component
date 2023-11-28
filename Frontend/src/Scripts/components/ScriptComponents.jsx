import React, { useEffect, useRef, useState } from "react";
import axiosClient from "../../axios-client";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import EditHeader from "../../common/commonLayouts/EditHeader";
import EditPage from "../../common/commonLayouts/EditPage";
import { ToastContainer, toast } from "react-toastify";
import { useMyContext } from "../../context/AppContext";

export const ScriptComponents = () => {
  const navigate = useNavigate();
  const params = useParams();
  const {getScript,script ,getScripts} = useMyContext();

  //hooks

  const [inputValue, setInputValue] = useState("");

  const [editorContent, setEditorContent] = useState([]);

  const [description, setDescription] = useState("");

  const [pageId, setPageId] = useState(null);

  const [treeNode, setTreeNode] = useState([]);

  const [renderScript, setRenderScript] = useState({});
  const [teamUuid, setTeamUuid] = useState([]);

  const [pageContent, setPageContent] = useState(null);

  const [particularTitle, setParticularTitle] = useState("");

  const [hoverPageId, setHoverPageId] = useState(null);

  const [particularPageId, setParticularPageId] = useState(null);

  const [editorValue, setEditorValue] = useState([]);

  const [shareState, setShareState] = useState(false);

  const [publish, setPublish] = useState([]);

  const [scriptError, setScriptError] = useState(null);

  const [loading, setLoading] = useState(false);

  const [state, setState] = useState(true);

  const [parentOpen, setParentOpen] = useState(null);

  const duration = 2000;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageIds = queryParams.get("pageId");



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

  //Api

  const getParticularPage = async () => {
    await axiosClient
      .get(`/getPage/${pageIds}`)
      .then((res) => {
        setParticularTitle(res.data.pages.title.split("-")[0]);
        setDescription(res.data.pages.description);
        setEditorValue(res.data.pages.content);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getParticularOpenScript = async () => {
    let script_uuid = params.slug;

    await axiosClient
      .get(`/getScriptAndPage/${script_uuid}`)
      .then((res) => {
        navigate(
          `/dashboard/${params.uuid}/s/${params.slug}/?pageId=${res.data.hierarchy[0].uuid}`
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getParentOpen = async () => {
    await axiosClient
      .get(`/getOpenParent/${pageIds}`)
      .then((res) => {
        setParentOpen(res.data.parentPages);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getParticularScript = async () => {
    let script_uuid = params.slug;
    await axiosClient
      .get(`/getScriptAndPage/${script_uuid}`)
      .then((res) => {
        if(res.status == 200){
          setInputValue(res.data.getScriptAndPages.title);
          setPageContent(res.data.hierarchy[0]);
          setTreeNode(res.data.hierarchy);
          setRenderScript(res.data.getScriptAndPages);
          setPublish(res.data.getScriptAndPages);
        }

      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Editor functionality

  const handleSave = () => {
    const postData = {
      id: pageIds,
      script_uuid: params.slug,
      title: particularTitle ? particularTitle : "Page Name",
      description: description ? description : "Page Description",
      content: editorContent,
    };

    axiosClient
      .post("/updatePageData", postData)
      .then((res) => {
        getParticularScript();

        showToastSaveMessage(res.data.msg);

      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addPage = async () => {
    await axiosClient
      .post(`/addPageData/${params.slug}`)
      .then((res) => {
        getParticularScript();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addChildPage = (uuid) => {
    let page_uuid = uuid;
    axiosClient
      .post(`/addChildPage/${params.slug}/${page_uuid}`)
      .then((res) => {
        getParticularScript();
        navigate(
          `/dashboard/${params.uuid}/s/${params.slug}/?pageId=${res.data.Pages.uuid}`
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = async (event) => {
    console.log("checing");
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
      .post("/addScriptTitle", payload)
      .then((res) => {
        getScripts();
        getScript();
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 403) {
          showToastErrorMessage(response.data.errorMsg);
        } else {
          console.error("Error:", response.status);
        }
      });
  };

  const contentPage = async (e) => {
    setPageId(e.target.id);
    let pageId = e.target.id;
 
    navigate(`/dashboard/${params.uuid}/s/${params.slug}/?pageId=${pageId}`);
  };

  const handleScriptMouseEnter = (e) => {
    setHoverPageId(e.target.id);
  };

  const handleScriptMouseLeave = (e) => {
    setHoverPageId(null);
  };

  const handleMore = (e) => {
    setParticularPageId(e.target.id);
    addChildPage(e.target.id);
  };

  const HandleShare = () => {
    setShareState(true);
  };

  const onChange = (checked) => {
    axiosClient
      .get(`/scripts/${params.slug}/${checked}`)
      .then((res) => {
        setRenderScript(res.data.publicUrl);
        setTeamUuid(params.uuid);
        {res.data.publicUrl.is_published ? showToastSaveMessage(res.data.msg) :showToastErrorMessage(res.data.msg)}

      })
      .catch((err) => {
        console.log(err);
      });
  };



  return (
    <div className="bg-white h-[85px]">
      <EditHeader
        widths={state ? "w-[1040px]" : "w-[1200px]"}
        clickPublish={handleSave}
        changeEvent={handleChange}
        inputValue={inputValue}
        setInputValue={setInputValue}
        renderScript={renderScript}
        HandleShare={HandleShare}
        scriptError={scriptError}
        publish={publish}
      />
      <EditPage
        widths={state ? "w-[785px]" : "w-[933px]"}
        marginEditor={state ? "ml-[10px]" : "mr-[115px]"}
        treeNode={treeNode}
        addPage={addPage}
        contentPage={contentPage}
        pageContent={pageContent}
        particularTitle={particularTitle}
        setParticularTitle={setParticularTitle}
        description={description}
        setDescription={setDescription}
        handleScriptMouseEnter={handleScriptMouseEnter}
        handleScriptMouseLeave={handleScriptMouseLeave}
        hoverPageId={hoverPageId}
        handleMore={handleMore}
        handleSave={handleSave}
        onDragEnd={onDragEnd}
        shareState={shareState}
        setShareState={setShareState}
        onChange={onChange}
        publish={publish}
        editorValue={editorValue}
        setEditorValue={setEditorValue}
        editorContent={editorContent}
        setEditorContent={setEditorContent}
        renderScript={renderScript}
        parentOpen={parentOpen}
        teamUuid={teamUuid}
      />
    </div>
  );
};
