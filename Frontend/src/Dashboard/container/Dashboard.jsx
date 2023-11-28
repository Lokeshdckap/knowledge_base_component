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
      .get(`${params.uuid}/search/items?q=${value}`)
      .then((res) => {
        if (res.data.length > 0) {
          console.log(res);
          setSearchData(res.data);
        } else {
          setSearchData(null);
        }
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 404) {
          setSearchData(null);
        } else {
          console.error("Error:", response.status);
        }
      });
  };


  return (
    <>
      <div className=" h-[80px] w-screen z-[10px] ">
        <>
          <Header
            widths={state ? "w-[1000px]" : "w-[1160px]"}
            team={teamName}
            HandleSearch={HandleSearch}
            searchInpRef={searchInpRef}
          />

          <Main
            widths={state ? "w-[1010px]" : "w-[1120px]"}
            team={teamName}
            batches={batch}
            scriptCount={scriptCount}
            scripts={script}
            addBatchEvent={addNewBatch}
            scriptEvent={addNewScript}
          />
        </>
      </div>
      {searchPopup && (
        <Search
          searchEvent={searchEvent}
          searchData={searchData}
          setsearchPopup={setsearchPopup}
          searchInpRef={searchInpRef}
        />
      )}

      {loading && (
        <>
          <div className="bg-primary opacity-[0.5] w-[1289px] h-[664px] absolute top-0 left-0  z-10"></div>
          <p className="absolute top-72 left-[600px] z-40">
            <HashLoader color="#3197e8" />
          </p>
        </>
      )}
    </>
  );
}
