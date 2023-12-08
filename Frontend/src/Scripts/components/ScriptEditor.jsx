import React, { useEffect, useRef, useState } from "react";
import axiosClient from "../../axios-client";
import { useNavigate, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import EditHeader from "../../common/commonLayouts/EditHeader";
import EditPage from "../../common/commonLayouts/EditPage";
import { ToastContainer, toast } from "react-toastify";
import { useMyContext } from "../../context/AppContext";
import { ViewHeader } from "../../common/commonLayouts/ViewHeader";
import { ViewPage } from "../../common/commonLayouts/ViewPage";

export const ScriptEditor = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { getScript, script, getScripts } = useMyContext();

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

  const [publish, setPublish] = useState([]);

  const [scriptError, setScriptError] = useState(null);

  const [loading, setLoading] = useState(false);

  const [state, setState] = useState(true);

  const [parentOpen, setParentOpen] = useState(null);

  const duration = 2000;

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
          `/dashboard/${params.uuid}/changes/${params.slug}/?pageId=${res.data.hierarchy[0].uuid}`
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
        if (res.status == 200) {
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

  const contentPage = async (e) => {
    setPageId(e.target.id);
    let pageId = e.target.id;
    navigate(
      `/dashboard/${params.uuid}/changes/${params.slug}/?pageId=${pageId}`
    );
  };

  const handleScriptMouseEnter = (e) => {
    setHoverPageId(e.target.id);
  };

  const handleScriptMouseLeave = (e) => {
    setHoverPageId(null);
  };

  const handleEdit = () => {
    axiosClient
      .get(`/scripts/${params.slug}/${false}`)
      .then((res) => {
        navigate(`/dashboard/${params.uuid}/s/${params.slug}`)

      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="bg-[#F9FAFB] h-screen w-screen overflow-auto z-[10px]">
      <ViewHeader
        widths={state ? "w-[1040px]" : "w-[1200px]"}
        inputValue={inputValue}
        setInputValue={setInputValue}
        renderScript={renderScript}
        scriptError={scriptError}
        publish={publish}
        handleEdit={handleEdit}
      />

      <ViewPage
        widths={state ? "w-[785px]" : "w-[933px]"}
        marginEditor={state ? "ml-[10px]" : "mr-[115px]"}
        treeNode={treeNode}
        contentPage={contentPage}
        pageContent={pageContent}
        particularTitle={particularTitle}
        setParticularTitle={setParticularTitle}
        description={description}
        setDescription={setDescription}
        handleScriptMouseEnter={handleScriptMouseEnter}
        handleScriptMouseLeave={handleScriptMouseLeave}
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
