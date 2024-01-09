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
import HashLoader from "react-spinners/HashLoader";



export const ScriptEditor = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { getScript, script, getScripts, role } = useMyContext();

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
  const [parentOpen, setParentOpen] = useState(null);

  const [emoji, setEmoji] = useState("");
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
    setLoading(true);
    await axiosClient
      .get(`/api/pages/getPage/${pageIds}`)
      .then((res) => {
        setParticularTitle(res.data.pages.title.split("-")[0]);
        setDescription(res.data.pages.description);
        setEmoji(res.data.pages.emoji);
        setEditorValue(res.data.pages.content);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getParticularOpenScript = async () => {
    setLoading(true);

    let script_uuid = params.slug;

    await axiosClient
      .get(`/api/dashboard/getScriptAndPage/${script_uuid}`)
      .then((res) => {
        navigate(
          `/dashboard/${params.uuid}/edit/${params.slug}/?pageId=${res.data.hierarchy[0].uuid}`
        );
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getParentOpen = async () => {
    setLoading(true);

    await axiosClient
      .get(`/api/dashboard/getOpenParent/${pageIds}`)
      .then((res) => {
        setParentOpen(res.data.parentPages);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const getParticularScript = async () => {
    setLoading(true);

    let script_uuid = params.slug;
    await axiosClient
      .get(`/api/dashboard/getScriptAndPage/${script_uuid}`)
      .then((res) => {
        if (res.status == 200) {
          setInputValue(res.data.getScriptAndPages.title);
          setPageContent(res.data.hierarchy[0]);
          setTreeNode(res.data.hierarchy);
          setRenderScript(res.data.getScriptAndPages);
          setPublish(res.data.getScriptAndPages);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const contentPage = async (e) => {
    setPageId(e.target.id);
    let pageId = e.target.id;
    navigate(
      `/dashboard/${params.uuid}/edit/${params.slug}/?pageId=${pageId}`
    );
  };

  const handleScriptMouseEnter = (e) => {
    setHoverPageId(e.target.id);
  };

  const handleScriptMouseLeave = (e) => {
    setHoverPageId(null);
  };

  const handleEdit = () => {
    setLoading(true);

    axiosClient
      .get(`/api/public/scripts/${params.slug}/${false}`)
      .then((res) => {
        navigate(`/dashboard/${params.uuid}/s/${params.slug}`);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <>
      <ViewHeader
        inputValue={inputValue}
        setInputValue={setInputValue}
        renderScript={renderScript}
        scriptError={scriptError}
        publish={publish}
        handleEdit={handleEdit}
        role={role}
      />

      <ViewPage
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
        emoji={emoji}
      />
      {loading && (
        <>
          <div className="bg-[#aeaeca] opacity-[0.5] w-[100%] h-[100vh] absolute top-0 left-0  z-10"></div>
          <div className="">
            <p className="absolute top-[48%] left-[48%] z-50 ">
              <HashLoader color="#3197e8" />
            </p>
          </div>
        </>
      )}
    </>
  );
};
