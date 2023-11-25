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
  const [data, setData] = useState(null);
  const [childScript, setChildScript] = useState([]);

  const [loading, setLoading] = useState(false);

  const [inviteError, setInviteError] = useState(null);

  //create Team state
  const [teamPopup, setTeamPopup] = useState(false);

  const [formValues, setFormValues] = useState({});
  const [errors, setError] = useState({});

  const [invitePopup, setInvitePopup] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [role, setRole] = useState("");

  //search states
  const [searchPopup, setsearchPopup] = useState(false);
  const [searchData, setSearchData] = useState(null);

  //state for overflow
  const [overflowState, setOverflowState] = useState("overflow-auto");

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

  //invite

  const handleInvite = () => {
    setInvitePopup(true);
  };

  const handleInviteUsers = () => {
    setLoading(true);
    console.log(inviteEmail);
    console.log(role);
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

      <ToastContainer />

      {loading && (
        <p className="absolute top-72 left-[600px] z-40">
          <HashLoader color="#3197e8" />
        </p>
      )}
    </>
  );
}
