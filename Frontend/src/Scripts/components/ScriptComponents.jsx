import React, { useEffect, useRef, useState } from "react";
import SideNav from "../../common/commonLayouts/SideNav";
import axiosClient from "../../axios-client";
import SideNavLarge from "../../common/commonLayouts/SideNavLarge";
import { useNavigate, useParams } from "react-router-dom";
import EditHeader from "../../common/commonLayouts/EditHeader";
import EditPage from "../../common/commonLayouts/EditPage";
import { PageTree } from "../../common/commonComponents/PageTree";

export const ScriptComponents = () => {
  const navigate = useNavigate();
  const param = useParams();

  //hooks

  //state
  const [state, setState] = useState(false);
  const [team, setTeam] = useState([]);
  const [allTeam, setAllTeam] = useState([]);
  const [batch, setBatch] = useState([]);
  const [script, setScript] = useState([]);

  const [childScript, setChildScript] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [editorContent, setEditorContent] = useState([]);

  const [description, setDescription] = useState("");

  const [pageId, setPageId] = useState(null);

  const [treeNode, setTreeNode] = useState([]);

  const [renderScript, setRenderScript] = useState([]);

  const [pageContent, setPageContent] = useState(null);

  const [particularTitle, setParticularTitle] = useState("");

  const [hoverPageId,setHoverPageId] = useState(null);

  const [particularPageId,setParticularPageId] = useState(null);

  useEffect(() => {
    getTeam();
    getAllTeam();
    getParticularScript(param.uuid);

  }, []);

  //Event

  const handleClick = () => {
    setState((prevState) => !prevState);
  };

  //Api

  const getParticularScript = async (uuid) => {
    let script_uuid = uuid;
    await axiosClient
      .get(`/getScriptAndPage/${script_uuid}`)
      .then((res) => {
        console.log(res);
        setInputValue(res.data.getScriptAndPages.title);
        setPageContent(res.data.hierarchy[0]);
        setTreeNode(res.data.hierarchy);
        setRenderScript(res.data.getScriptAndPages);
        setParticularTitle(res.data.hierarchy[0].title);
        setDescription(res.data.hierarchy[0].description);
        setEditorContent(res.data.hierarchy[0].content);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTeam = async () => {
    let teamUUID = localStorage.getItem("team_uuid");
    await axiosClient
      .get(`/getTeam/${teamUUID}`)
      .then((res) => {
        setTeam(res.data[0]);
        getBatch(teamUUID);
        getScript(teamUUID);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAllTeam = () => {
    axiosClient
      .get(`/getAllTeam`)
      .then((res) => {
        setAllTeam(res.data.getAllTeam);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBatch = async (teamuuid) => {
    await axiosClient
      .get(`/getBatch/${teamuuid}`)
      .then((res) => {
        setBatch(res.data.batchs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getScript = async (teamuuid) => {
    await axiosClient
      .get(`/getScript/${teamuuid}`)
      .then((res) => {
        setScript(res.data.script);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addNewBatch = (e) => {
    let team_uuid = localStorage.getItem("team_uuid");

    axiosClient
      .post("/addNewBatch", { uuid: team_uuid })
      .then((res) => {
        getBatch(team_uuid);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addNewScript = (e) => {
    let team_uuid = localStorage.getItem("team_uuid");
    let batch_uuid = e.target.id;

    axiosClient
      .post("/addNewScript", { uuid: team_uuid, batch_uuid: batch_uuid })
      .then((res) => {
        getScript(team_uuid);
        setPageContent(res.data.pages);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const switchTeamEvent = (e) => {
    const TeamId = e.target.id;
    localStorage.removeItem("team_uuid");
    localStorage.setItem("team_uuid", TeamId);
    getTeam();
    getAllTeam();
    navigate(`/dashboard/${localStorage.getItem("team_uuid")}`);
  };

  let batch_uuid;

  const handleChildrenScripts = async (e) => {
    let team_uuid = localStorage.getItem("team_uuid");
    batch_uuid = e.target.id;

    await axiosClient
      .get(`/getBatchAndScripts/${team_uuid}/${batch_uuid}`)
      .then((res) => {
        setChildScript(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //Editor functionality

  const handleSave = () => {
    const postData = {
      id: pageId,
      title: particularTitle,
      description: description,
      content: editorContent,
    };

    axiosClient
      .post("/updatePageData", postData)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    getParticularScript(param.uuid);
  };

  const addPage = () => {
    
    axiosClient
      .post(`/addPageData/${param.uuid}`)
      .then((res) => {
        getParticularScript(param.uuid);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addChildPage = (uuid) => {
    console.log(uuid,"ll");
    let page_uuid = uuid;
    axiosClient
    .post(`/addPageData/${param.uuid}/${page_uuid}`)
    .then((res) => {
      // getParticularScript(param.uuid);
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  const handleChange = async (event) => {
    const inputValue = event;

    const encodedInputValue = encodeURIComponent(inputValue);

    setInputValue(inputValue); // Update the state with the current value

    let paraId = param.uuid;

    try {
      const response = await axiosClient.get(
        `/addScriptTitle?inputValue=${encodedInputValue}&queryParameter=${paraId}`
      );

      console.log(response);
    } catch (err) {
      console.log(err);

    }
  };


  const contentPage = (e) => {
    setPageId(e.target.id);
    let pageId = e.target.id;
    axiosClient
      .get(`/getPage/${pageId}`)
      .then((res) => {
        setPageContent(res.data.pages[0]);
        setParticularTitle(res.data.pages[0].title);
        setDescription(res.data.pages[0].description);
        setEditorContent(res.data.pages[0].content);
      })
      .catch((err) => {
        console.log(err);
      });
  };


    const handleScriptMouseEnter = (e) =>{
      setHoverPageId(e.target.id);
      console.log("ehe");
    }

    const handleScriptMouseLeave = (e) => {
      setHoverPageId(null);
    }

    const handleMore = (e) =>{
      setParticularPageId(e.target.id);
      addChildPage(e.target.id);
    }



  return (
    <div className="relative">
      <div className="flex bg-[#ECEDEF] ">
        {state ? (
          <SideNavLarge
            buttonClicked={handleClick}
            team={team}
            allTeams={allTeam}
            clickSwitch={switchTeamEvent}
            addBaltchEvent={addNewBatch}
            scriptEvent={addNewScript}
            batches={batch}
            scripts={script}
            handleChildrenScripts={handleChildrenScripts}
            childScript={childScript}
            getParticularScript={getParticularScript}
          />
        ) : (
          <SideNav
            buttonClicked={handleClick}
            team={team}
            addBatchEvent={addNewBatch}
            scriptEvent={addNewScript}
          />
        )}

        <div className="bg-[#F9FAFB] h-[80px] w-screen z-[10px] ">
          <EditHeader
            widths={state ? "w-[1040px]" : "w-[1200px]"}
            clickPublish={handleSave}
            changeEvent={handleChange}
            inputValue={inputValue}
            setInputValue={setInputValue}
            renderScript={renderScript}
          />

          <EditPage
            widths={state ? "w-[785px]" : "w-[933px]"}
            marginEditor={state ? "ml-[10px]" : "mr-[115px]"}
            editorContent={editorContent}
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
          />

          {/* <BatchHeader widths={state ? "w-[1000px]" : "w-[1160px]"} />
          <BatchLayouts widths={state ? "w-[1000px]" : "w-[1120px]"} /> */}
        </div>
      </div>
    </div>
  );
};
