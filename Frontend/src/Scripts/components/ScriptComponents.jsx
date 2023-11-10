import React, { useEffect, useRef, useState } from "react";
import SideNav from "../../common/commonLayouts/SideNav";
import axiosClient from "../../axios-client";
import SideNavLarge from "../../common/commonLayouts/SideNavLarge";
import { useNavigate, useParams } from "react-router-dom";
import EditHeader from "../../common/commonLayouts/EditHeader";
import EditPage from "../../common/commonLayouts/EditPage";
import { PageTree } from "../../common/commonComponents/PageTree";
import { InviteUsers } from "../../common/commonLayouts/InviteUsers";

export const ScriptComponents = () => {
  const navigate = useNavigate();
  const param = useParams();

  //hooks

  //state
  const [state, setState] = useState(true);
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

  const [hoverPageId, setHoverPageId] = useState(null);

  const [particularPageId, setParticularPageId] = useState(null);

  const [editorValue, setEditorValue] = useState([]);

  const [shareState, setShareState] = useState(false);

  const [publish, setPublish] = useState([]);

  const [invitePopup, setInvitePopup] = useState(false);

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
    console.log(script_uuid);
    await axiosClient
      .get(`/getScriptAndPage/${script_uuid}`)
      .then((res) => {
        setInputValue(res.data.getScriptAndPages.title);
        setPageContent(res.data.hierarchy[0]);
        setTreeNode(res.data.hierarchy);
        setRenderScript(res.data.getScriptAndPages);
        setParticularTitle(res.data.hierarchy[0].title);
        setDescription(res.data.hierarchy[0].description);
        setEditorContent(res.data.hierarchy[0].content);
        setEditorValue(res.data.hierarchy[0].content);
        setPublish(res.data.getScriptAndPages);
        localStorage.setItem("myData", JSON.stringify(res.data.hierarchy[0]));
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
        console.log(res, "here");
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
    // console.log(editorValue);
    // setEditorContent(editorContentData);
    const postData = {
      id: pageId,
      title: particularTitle ? particularTitle : "Page Name",
      description: description ? description : "Page Description",
      content: editorContent,
    };

    console.log(postData);
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
    // console.log(uuid,"ll");
    console.log(uuid);
    let page_uuid = uuid;
    axiosClient
      .post(`/addChildPage/${param.uuid}/${page_uuid}`)
      .then((res) => {
        getParticularScript(param.uuid);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
        setEditorValue(res.data.pages[0].content);
        setEditorContent(res.data.pages[0].content);
      })
      .catch((err) => {
        console.log(err);
      });
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

  const onChange = (checked) => {
    axiosClient
      .get(`/scripts/${param.uuid}/${checked}`)
      .then((res) => {
        setRenderScript(res.data.publicUrl);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
            HandleShare={HandleShare}
          />
          <EditPage
            widths={state ? "w-[785px]" : "w-[933px]"}
            marginEditor={state ? "ml-[10px]" : "mr-[115px]"}
            editorContent={editorValue}
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
            editorContents={editorContent}
            onDragEnd={onDragEnd}
            shareState={shareState}
            setShareState={setShareState}
            onChange={onChange}
            publish={publish}
            renderScript={renderScript}
          />
          {/* <BatchHeader widths={state ? "w-[1000px]" : "w-[1160px]"} />
          <BatchLayouts widths={state ? "w-[1000px]" : "w-[1120px]"} /> */}
        </div>
        {/* {invitePopup && 
              <InviteUsers

               invitePopup={invitePopup}
               setInvitePopup={setInvitePopup}
              /> 
          } */}
      </div>
    </div>
  );
};
