import React, { useEffect, useRef, useState } from "react";
import SideNav from "../../common/commonLayouts/SideNav";
import axiosClient from "../../axios-client";
import SideNavLarge from "../../common/commonLayouts/SideNavLarge";
import { useNavigate, useParams} from "react-router-dom";
import { useLocation } from 'react-router-dom';
import EditHeader from "../../common/commonLayouts/EditHeader";
import EditPage from "../../common/commonLayouts/EditPage";
import { PageTree } from "../../common/commonComponents/PageTree";
import { InviteUsers } from "../../common/commonLayouts/InviteUsers";
import { ModelPopup } from "../../common/commonComponents/ModelPopup";
import { ToastContainer, toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

export const ScriptComponents = () => {
  const navigate = useNavigate();
  const params = useParams();

  //hooks

  //state

  const [formValues, setFormValues] = useState({});
  const [errors, setError] = useState({});
  const [state, setState] = useState(true);
  const [team, setTeam] = useState([]);
  const [allTeam, setAllTeam] = useState([]);
  const [batch, setBatch] = useState([]);
  const [script, setScript] = useState([]);
  const [teamPopup, setTeamPopup] = useState(false);

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

  const [overStates, setOverStates] = useState(null);

  const [inviteEmail, setInviteEmail] = useState("");

  const [role, setRole] = useState("");

  const [index, setIndex] = useState(null);

  const [loading, setLoading] = useState(false);

  const [inviteError, setInviteError] = useState(null);

  const [parentOpen,setParentOpen] = useState(null);


      const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const pageIds = queryParams.get('pageId');


  useEffect(() => {
    

      if(pageIds){
        getTeam();
        getAllTeam();
        getParticularScript();
        getScripts();
        getParticularPage();
        getParentOpen();
      }
      else{
        getTeam();
        getAllTeam();
        getParticularScript();
        getScripts();
        getParticularOpenScript();
      }
      
  }, [pageIds,params.slug]);


  //Event

  const handleClick = () => {
    setState((prevState) => !prevState);
  };

  //Api

  const getParticularPage = async () => {
      await axiosClient
      .get(`/getPage/${pageIds}`)
      .then((res) => {
        setParticularTitle(res.data.pages.title);
        setDescription(res.data.pages.description);
        setEditorValue(res.data.pages.content);
        setEditorContent(res.data.pages.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }


  const getParticularOpenScript = async () => {
    let script_uuid = params.slug;

    await axiosClient 
      .get(`/getScriptAndPage/${script_uuid}`)
      .then((res) => {
        navigate(`/dashboard/${params.uuid}/s/${params.slug}/?pageId=${res.data.hierarchy[0].uuid}`)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const getParentOpen = async () =>{

    await axiosClient.get(`/getOpenParent/${pageIds}`)
    .then((res) => {
      setParentOpen(res.data.parentData.uuid);
    })
    .catch((err) => {
      console.log(err);
    });
  }

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

  const getScripts = async() => {
   await axiosClient.get(`/getScripts/${params.uuid}/${params.slug}`).then((res) => {
      setOverStates(res.data.script_batch.batch_uuid);
      setChildScript(res.data.result);
    });
  };

  const getTeam = async () => {
    let teamUUID = params.uuid;
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
    let team_uuid = params.uuid;

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
    let team_uuid = params.uuid;
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
    getTeam();
    getAllTeam();
    setTeamPopup(false);
    navigate(`/dashboard/${TeamId}`);
  };

  let batch_uuid;

  const handleChildrenScripts = async (e) => {
    let team_uuid = params.uuid;
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
      id: pageIds,
      title: particularTitle ? particularTitle : "Page Name",
      description: description ? description : "Page Description",
      content: editorContent,
    };

    axiosClient
      .post("/updatePageData", postData)
      .then((res) => {
        getParticularScript();
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
        // console.log("gjhk");
        // console.log(res);
        console.log(res.data.Pages);
        navigate(`/dashboard/${params.uuid}/s/${params.slug}/?pageId=${res.data.Pages.uuid}`)

        
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = async (event) => {
    const inputValue = event;

    const encodedInputValue = encodeURIComponent(inputValue);

    setInputValue(inputValue); // Update the state with the current value

    let paraId = params.slug;

    axiosClient
      .get(
        `/addScriptTitle?inputValue=${encodedInputValue}&queryParameter=${paraId}`
      )
      .then((res) => {
        getScripts()
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const contentPage = (e) => {
    setPageId(e.target.id);
    let pageId = e.target.id;
    let pagePath = e.target.dataset.set;
    navigate(`/dashboard/${params.uuid}/s/${params.slug}/?pageId=${pageId}`)
    // if(pagePath !== undefined){
    //     let pagePathArray = pagePath.split("/");
    //     let pageSplitPath = pagePathArray.slice(2).join("/");
    //     navigate(`/dashboard/${params.uuid}/s/${params.slug}/${pageSplitPath}`)
    // }
    // axiosClient
    //   .get(`/getPage/${pageId}`)
    //   .then((res) => {
    //     setPageContent(res.data.pages[0]);
    //     setParticularTitle(res.data.pages[0].title);
    //     setDescription(res.data.pages[0].description);
    //     setEditorValue(res.data.pages[0].content);
    //     setEditorContent(res.data.pages[0].content);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
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

  const handleCreate = () => {
    setTeamPopup(true);
  };

  const handleCancel = () => {
    setTeamPopup(false);
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
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createTeam = () => {
    const validationErrors = {};
    if (!formValues.team_name) {
      validationErrors.team_name = "Team is required";
    }
    setError(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      axiosClient
        .post("/team", formValues)
        .then((res) => {
          setTeamPopup(false);
          getAllTeam();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 400) {
            let error = {};
            let keys = Object.keys(response.data);
            let value = Object.values(response.data);
            error[keys] = value;
            setError(error);
          } else {
            console.error("Error:", response.status);
          }
        });
    }
  };

  const handleInviteUsers = () => {

    setLoading(true);
    console.log(inviteEmail);
    if(!inviteEmail.trim()) {
    setLoading(false);
      
      setInviteError("Email is required");
    }
    else if(!role.trim()) {
      setLoading(false);
        
        setInviteError("Role is required");
      }
    else{

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
    <div className="relative">
      <div className="flex bg-[#ECEDEF] h-screen overflow-auto ">
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
            handleCreate={handleCreate}
            setInvitePopup={setInvitePopup}
            overStates={overStates}
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
          />
          {teamPopup && (
            <ModelPopup
              click={handleCancel}
              HandleChange={HandleChange}
              createTeam={createTeam}
              columnName={"team_name"}
              error={errors}
            />
          )}
          {invitePopup && (
            <InviteUsers
            team={team}
              invitePopup={invitePopup}
              setInvitePopup={setInvitePopup}
              setInviteEmail={setInviteEmail}
              inviteEmail={inviteEmail}
              setRole={setRole}
              handleInviteUsers={handleInviteUsers}
              inviteError={inviteError}
            />
          )}
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
