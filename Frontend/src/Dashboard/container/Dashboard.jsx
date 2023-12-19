import React, { useEffect, useRef, useState } from "react";
import Header from "../../common/commonLayouts/Header";
import Main from "../../common/commonLayouts/Main";
import axiosClient from "../../axios-client";
import { useNavigate, useParams } from "react-router-dom";
import { Search } from "../../common/commonLayouts/Search";
import { ToastContainer, toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";
import { useMyContext } from "../../context/AppContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const params = useParams();
  const searchInpRef = useRef();

  const {
    getScript,
    teamName,
    script,
    getBatch,
    batch,
    scriptCount,
    addNewBatch,
    addNewScript,
    showToastMessage,
    userInfo,
    userDetail,
  } = useMyContext();

  //hooks

  //state



  const [state, setState] = useState(true);
  const [loading, setLoading] = useState(false);

  //search states
  const [searchPopup, setsearchPopup] = useState(false);
  const [searchData, setSearchData] = useState(null);

  // search

  const HandleSearch = () => {
    setsearchPopup(true);
  };

  const searchEvent = async (e) => {
    let value = e.target.value;

    await axiosClient
      .get(`/api/dashboard/${params.uuid}/search/items?q=${value}`)
      .then((res) => {
        console.log(res.data,"lokeshdata");
        if (res.data.scripts.length > 0 || res.data.pages.length > 0) {
          setSearchData(res.data);
        } 
        else {
          setSearchData(null);
        }
      })
      .catch((err) => {
        const response = err.response;
        if (response && response?.status === 404) {
          setSearchData(null);
        } else {
          console.error("Error:", response?.status);
        }
      });
  };

  const handleTrash = (e) => {
    let targetId = e.target.id;

    if (targetId) {
      setLoading(true);
      axiosClient
        .put(`/api/trash/moveToTrash/${params.uuid}/${targetId}`)
        .then((res) => {
          if (res.status == 200) {
            setLoading(false);
            getBatch();
            getScript();
          }
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 400) {
          } else {
            console.error("Error:", response.status);
          }
        });
    }
  };

  return (
    <>
      
        <Header
          team={teamName}
          HandleSearch={HandleSearch}
          searchInpRef={searchInpRef}
          userDetail={userDetail}
        />
        <Main
            team={teamName}
            batches={batch}
            scriptCount={scriptCount}
            scripts={script}
            addBatchEvent={addNewBatch}
            scriptEvent={addNewScript}
            handleTrash={handleTrash}
          />
      
      {searchPopup && (
        <Search
          searchEvent={searchEvent}
          searchData={searchData}
          setsearchPopup={setsearchPopup}
          searchInpRef={searchInpRef}
        />
      )}

    </>
  );
}
