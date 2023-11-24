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

  //state

  const [formValues, setFormValues] = useState({});
  const [errors, setError] = useState({});
  const [state, setState] = useState(true);
  const [team, setTeam] = useState([]);
  const [allTeam, setAllTeam] = useState([]);
  const [batch, setBatch] = useState([]);
  const [teamPopup, setTeamPopup] = useState(false);

  const [childScript, setChildScript] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editorContent, setEditorContent] = useState([]);

  const [description, setDescription] = useState("");

  const [pageId, setPageId] = useState(null);

  const [treeNode, setTreeNode] = useState([]);

  const [renderScript, setRenderScript] = useState([]);
  const [teamUuid, setTeamUuid] = useState([]);

  const [pageContent, setPageContent] = useState(null);

  const [particularTitle, setParticularTitle] = useState("");

  const [hoverPageId, setHoverPageId] = useState(null);

  const [particularPageId, setParticularPageId] = useState(null);

  const [editorValue, setEditorValue] = useState([]);

  const [shareState, setShareState] = useState(false);

  const [publish, setPublish] = useState([]);

  const [invitePopup, setInvitePopup] = useState(false);

  const [overStates, setOverStates] = useState(null);

  const [inviteEmail, setInviteEmail] = useState("");

  const [role, setRole] = useState("");

  const [scriptError, setScriptError] = useState(null);

  const [loading, setLoading] = useState(false);

  const [inviteError, setInviteError] = useState(null);

  const [parentOpen, setParentOpen] = useState(null);

  const duration = 2000;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageIds = queryParams.get("pageId");

  const showToastMessage = (data) => {
    toast.success(data, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

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
        setParticularTitle(res.data.pages.title.slice(0, -5));
        setDescription(res.data.pages.description);
        setEditorValue(res.data.pages.content);
        setEditorContent(res.data.pages.content);
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
        setInputValue(res.data.getScriptAndPages.title);
        setPageContent(res.data.hierarchy[0]);
        setTreeNode(res.data.hierarchy);
        setRenderScript(res.data.getScriptAndPages);
        setPublish(res.data.getScriptAndPages);
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

        showToastMessage(res.data.msg);

      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addPage = () => {
    axiosClient
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
    const encodedInputValue = encodeURIComponent(inputValue);
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

  const contentPage = (e) => {
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

  const onDragEnd = (result) => {
    // Handle the drag-and-drop logic here
    if (!result.destination) {
      return;
    }
    // Update your treeData based on the drag-and-drop result
    const updatedTree = [...treeNode];
    const [movedNode] = updatedTree.splice(result.source.index, 1);
    updatedTree.splice(result.destination.index, 0, movedNode);

    setTreeNode(updatedTree);
    // setTreeData(/* Updated tree data */);
  };

  const HandleShare = () => {
    setShareState(true);
  };

  const HandleChange = (e) => {
    const { name, value } = e.target;
    console.log(e.target.value);
    setFormValues({ ...formValues, [name]: value });
    delete errors[name];
  };

  const onChange = (checked) => {
    axiosClient
      .get(`/scripts/${params.slug}/${checked}`)
      .then((res) => {
        setRenderScript(res.data.publicUrl);
        setTeamUuid(params.uuid);
        {res.data.publicUrl.is_published ? showToastMessage(res.data.msg) :showToastErrorMessage(res.data.msg)}

      })
      .catch((err) => {
        console.log(err);
      });
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
      />
      <EditPage
        widths={state ? "w-[785px]" : "w-[933px]"}
        marginEditor={state ? "ml-[10px]" : "mr-[115px]"}
        setEditorContent={setEditorContent}
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
        editorContent={editorContent}
        onDragEnd={onDragEnd}
        shareState={shareState}
        setShareState={setShareState}
        onChange={onChange}
        publish={publish}
        editorValue={editorValue}
        renderScript={renderScript}
        parentOpen={parentOpen}
        teamUuid={teamUuid}
      />
    </div>
  );
};
