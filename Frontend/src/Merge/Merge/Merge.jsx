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

  const [state, setState] = useState(true);

  const [parentOpen, setParentOpen] = useState(null);

  const [popUp, setPopUp] = useState(null);

  const [isLoading, setIsLoading] = useState(null);

  const [urlCopyPopup, setUrlCopyPopup] = useState(false);
  //page count

  const [maintainPageCount, setMaintainPageCount] = useState(null);

  const [instance, setInstance] = useState("");

  const [inputStr, setInputStr] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const [pageDeleteConfirmation, setPageDeleteConfirmation] = useState(null);

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
    setIsLoading(true);
    await axiosClient
      .get(`/api/pages/getPage/${pageIds}`)
      .then((res) => {
        setParticularTitle(res.data.pages.title.split("-")[0]);
        setDescription(res.data.pages.description);
        setInputStr(res.data.pages.emoji);
        setEditorValue(res.data.pages.content);
        setEditorContent(res.data.pages.content);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const getParticularOpenScript = async () => {
    let script_uuid = params.slug;

    await axiosClient
      .get(`/api/dashboard/getScriptAndPage/${script_uuid}`)
      .then((res) => {
        navigate(
          `/dashboard/${params.uuid}/changes/${params.slug}/?pageId=${res.data.hierarchy[0].uuid}`
        );
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

  const handleSave = () => {
    setLoading(true);

    const postData = {
      id: pageIds,
      script_uuid: params.slug,
      title: particularTitle ? particularTitle : "Page Name",
      description: description ? description : "Page Description",
      content: editorContent,
      emoji: inputStr,
    };

    axiosClient
      .post("/api/pages/updatePageData", postData)
      .then((res) => {
        getParticularScript();
        getParticularPage();
        showToastSaveMessage(res.data.msg);
        setLoading(false);
        setHasChanges(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const handleSaveAndPublish = () => {
    setLoading(true);

    const postData = {
      id: pageIds,
      script_uuid: params.slug,
      title: particularTitle ? particularTitle : "Page Name",
      description: description ? description : "Page Description",
      content: editorContent,
      emoji: inputStr,
    };
    axiosClient
      .post("/api/pages/updatePageData", postData)
      .then((res) => {
        getParticularScript();
        getParticularPage();
        setLoading(false);
        setHasChanges(false);

        contentPublish(true);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const contentPublish = (checked) => {
    setLoading(true);

    axiosClient
      .get(`/api/public/scripts/${params.slug}/${checked}`)

      .then((res) => {
        setRenderScript(res.data.publicUrl);
        setUrlCopyPopup(true);
        setTeamUuid(params.uuid);
        setLoading(false);
        {
          res.data.publicUrl.is_published
            ? showToastSaveMessage("Save and Published successsfully")
            : showToastErrorMessage(res.data.msg);
        }
      })

      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const addPage = async () => {
    setLoading(true);
    await axiosClient
      .post(`/api/pages/addPageData/${params.slug}`)
      .then((res) => {
        getParticularScript();
        setLoading(false);
        showToastSaveMessage(res.data.msg);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const addChildPage = (uuid) => {
    setLoading(true);
    let page_uuid = uuid;
    axiosClient
      .post(`/api/pages/addChildPage/${params.slug}/${page_uuid}`)
      .then((res) => {
        getParticularScript();
        handleSave();
        window.location.replace(
          `/dashboard/${params.uuid}/s/${params.slug}/?pageId=${res.data.Pages.uuid}`
        );
        showToastSaveMessage(res.data.msg);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const contentPage = async (e) => {
    setHasChanges(false);
    setPageId(e.target.id);
    let pageId = e.target.id;

    if (pageId != pageIds) {
      const postData = {
        id: pageIds,
        script_uuid: params.slug,
        title: particularTitle ? particularTitle : "Page Name",
        description: description ? description : "Page Description",
        content: editorContent,
        emoji: inputStr,
      };

      axiosClient
        .post("/api/pages/updatePageData", postData)
        .then((res) => {
          getParticularScript();
          getParticularPage();

          setHasChanges(false);

          window.location.replace(
            `/dashboard/${params.uuid}/changes/${params.slug}/?pageId=${pageId}`
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
    setPopUp(null);
    setHoverPageId(null);

    if (localStorage.getItem("mainId")) {
      localStorage.removeItem("mainId");
    }
  };

  const handlePageDelete = async (e) => {
    let targetId = e.target.id;
    setLoading(true);

    if (targetId) {
      await axiosClient
        .delete(`/api/pages/permanentDeletePage/${targetId}`)
        .then((res) => {
          setPageDeleteConfirmation(null);
          if (res.data.page.page_uuid != null) {
            navigate(
              `/dashboard/${params.uuid}/changes/${params.slug}/?pageId=${res.data.page.page_uuid}`
            );
            setLoading(false);
            showToastErrorMessage(res.data.Success);
          } else {
            navigate(`/dashboard/${params.uuid}/changes/${params.slug}/`);
            setLoading(false);
            showToastErrorMessage(res.data.Success);
          }
        })
        .catch((err) => {
          const response = err.response;
          console.error("Error:", response?.status);
          setLoading(false);
        });
    }
    if (localStorage.getItem("mainId")) {
      localStorage.removeItem("mainId");
    }
  };

  const HandleShare = () => {
    setShareState(true);
  };

  const onChange = (checked) => {
    axiosClient
      .get(`/api/public/scripts/${params.slug}/${checked}`)

      .then((res) => {
        setRenderScript(res.data.publicUrl);
        setTeamUuid(params.uuid);
        {
          res.data.publicUrl.is_published
            ? showToastSaveMessage(res.data.msg)
            : showToastErrorMessage(res.data.msg);
        }
      })

      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeletePage = () => {
    setPageDeleteConfirmation(null);
    if (localStorage.getItem("mainId")) {
      localStorage.removeItem("mainId");
    }
  };
  const handleEdit = () => {
    setLoading(true);
    let payLoad = {
      script_uuid: params.slug,
      status: "merge-request",
    };
    axiosClient
      .put(`/api/scripts/updateStatus`, payLoad)
      .then((res) => {
        navigate(`/dashboard/${params.uuid}/changes/${params.slug}`);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (hasChanges) {
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasChanges]);

  const handleMerge = () => {
    setLoading(true);
    let payLoad = {
      script_uuid: params.slug,
      status: "edit-request",
    };
    axiosClient
      .put(`/api/scripts/updateStatus`, payLoad)
      .then((res) => {
        navigate(`/dashboard/${params.uuid}/edit/${params.slug}`);
        setLoading(false);
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
        shareState={shareState}
        setShareState={setShareState}
        onChange={onChange}
        editorValue={editorValue}
        setEditorValue={setEditorValue}
        editorContent={editorContent}
        setEditorContent={setEditorContent}
        parentOpen={parentOpen}
        teamUuid={teamUuid}
        setHoverPageId={setHoverPageId}
        popUp={popUp}
        setPopUp={setPopUp}
        handlePageDelete={handlePageDelete}
        isLoading={isLoading}
        maintainPageCount={maintainPageCount}
        inputStr={inputStr}
        setInputStr={setInputStr}
        showPicker={showPicker}
        setShowPicker={setShowPicker}
        setPageDeleteConfirmation={setPageDeleteConfirmation}
        clickPublish={handleSave}
        handleDeletePage={handleDeletePage}
        pageDeleteConfirmation={pageDeleteConfirmation}
        handleMerge={handleMerge}
      />
    </div>
  );
};
