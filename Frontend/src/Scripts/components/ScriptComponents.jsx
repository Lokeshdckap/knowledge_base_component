import React, { useEffect, useState } from 'react'
import SideNav from '../../common/commonLayouts/SideNav';
import axiosClient from '../../axios-client';
import SideNavLarge from '../../common/commonLayouts/SideNavLarge';
import { useNavigate, useParams } from 'react-router-dom';
import EditHeader from '../../common/commonLayouts/EditHeader';
import EditPage from '../../common/commonLayouts/EditPage';
import { PageTree } from '../../common/commonComponents/PageTree';

export const ScriptComponents = () => {


    const navigate = useNavigate();
    
   //hooks
   
   useEffect(() => {
    getTeam();
    getAllTeam();
    getParticularScript();

  }, []);

  const param = useParams();





  //state
  const [state, setState] = useState(false);
  const [team, setTeam] = useState([]);
  const [allTeam, setAllTeam] = useState([]);
  const [batch, setBatch] = useState([]);
  const [script, setScript] = useState([]);
  const [data, setData] = useState(null);
  const [childScript, setChildScript] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const [treeNode,setTreeNode] = useState([])



//Event
  const handleClick = () => {
    setState((prevState) => !prevState);
  };





//Api

  const getParticularScript = async () =>{
       let script_uuid = param.uuid
      await axiosClient.get(`/getScriptAndPage/${script_uuid}`)
       .then((res)=>{
        // console.log(res);
          setTreeNode(res.data)
        // setInputValue(res.data.getScriptAndPages[0].title)
       })
       .catch((err) => {
        console.log(err);
      });
  }

  // getParticularScript()


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

    axiosClient.post("/addNewBatch", {"uuid" : team_uuid})
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

    axiosClient.post("/addNewScript",{"uuid" : team_uuid,"batch_uuid":batch_uuid})
    .then((res) => {
          getScript(team_uuid);
      })
      .catch((err) => {
        console.log(err);
      });

  }

  const switchTeamEvent = (e) => {
    const TeamId = e.target.id;
    localStorage.removeItem("team_uuid");
    localStorage.setItem("team_uuid", TeamId);
    getTeam();
    getAllTeam();
    navigate(`/dashboard/${localStorage.getItem("team_uuid")}`)

  };


  const handleChildrenScripts = async(e) =>{

    let team_uuid = localStorage.getItem("team_uuid");
    let batch_uuid = e.target.id
    
    await axiosClient
    .get(`/getBatchAndScripts/${team_uuid}/${batch_uuid}`)
    .then((res) => {
      setChildScript(res.data.result);

    })
    .catch((err) => {
      console.log(err);
    });
  }



  const handleSave = () =>{
    console.log(data);
      
  }

  const getValue =(data) =>{
    setData(data);

   }



   const handleChange = (event) => {
    const newValue = event.target.value;
    
    setInputValue(newValue);
    let paraId = param.uuid;
   
    axiosClient.get(`/addScriptTitle?inputValue=${newValue}&queryParameter=${paraId}`)
      .then((res) => {
        // setResponseData(response.data);
        
        
        console.log(res);
      })
      .catch((error) => {
        console.error(error);
      });

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
          addBaltchEvent = {addNewBatch}
          scriptEvent={addNewScript}
          batches={batch}
          scripts={script}
          handleChildrenScripts={handleChildrenScripts}
          childScript={childScript}
        />
      ) : (
        <SideNav buttonClicked={handleClick} team={team} addBatchEvent = {addNewBatch} scriptEvent={addNewScript} />
      )}

      <div className="bg-[#F9FAFB] h-[80px] w-screen z-[10px] ">


      



        <EditHeader widths={state ? "w-[1040px]" : "w-[1200px]"} clickPublish={handleSave} changeEvent={handleChange} stateValue={inputValue}/> 
        <EditPage widths={state ? "w-[800px]" : "w-[933px]"} marginEditor={state ?  "ml-[10px]" : "mr-[115px]"} getValue={getValue}/>


          {/* <BatchHeader widths={state ? "w-[1000px]" : "w-[1160px]"} />
          <BatchLayouts widths={state ? "w-[1000px]" : "w-[1120px]"} /> */}

{/* 
            <Header
              widths={state ? "w-[1000px]" : "w-[1160px]"}
              team={team}
            />

         <Main
          widths={state ? "w-[1000px]" : "w-[1120px]"}
          team={team} batches={batch} scripts={script}
          addBatchEvent = {addNewBatch} scriptEvent={addNewScript}
        />  */}



        




        
      </div>
    </div>

    <div>
      <h1>Page Hierarchy</h1>
      <PageTree pages={treeNode} />
    </div>
  </div>
  )
}
