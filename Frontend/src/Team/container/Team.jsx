import React, { useEffect, useState } from "react";
import { TeamComponents } from "../components/TeamComponents";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { ToastContainer, toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

export const Team = () => {
  const [teamName, setTeamName] = useState("");
  const [message, setMessage] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);

  const [invitePopup, setInvitePopup] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [userInfos, setUserInfo] = useState([]);
  const [userName, setUserName] = useState("");

  const [inviteError, setInviteError] = useState(null);
  const [role, setRole] = useState("");

  const params = useParams();

  useEffect(() => {
    team();
    allUsers();
    if (params.slug == "profile") {
      userInfo();
    }
  }, [params, params.slug]);


  let duration = 2000
  const showToastMessage = (data) => {
    toast.success(data, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: duration,
      hideProgressBar: true,
      draggable: true,
      closeOnClick: true,
    });
  };

  const showToastErrorMessage = (data) => {
    toast.warning(data, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: duration,
      hideProgressBar: true,
      draggable: true,
      closeOnClick: true,
    });
  };

  const team = () => {
    axiosClient
      .get(`/getTeam/${params.uuid}`)
      .then((res) => {
        setTeamName(res.data.Teams[0].name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const allUsers = () => {
    axiosClient
      .get(`/getAciveUsers/${params.uuid}`)
      .then((res) => {
        setTeamMembers(res.data.userDetail);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = () => {
    if (teamName) {
      axiosClient
        .post("/updateTeamName", {
          uuid: params.uuid,
          name: teamName,
        })
        .then((res) => {
          setMessage(res.data.Success);

          team();
          setTimeout(() => {
            setMessage("");
          }, 1500);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      showToastErrorMessage("please fill the input field");
    }
  };

  const handleInvite = () => {
    setInvitePopup(true);
  };

  const handleInviteUsers = () => {
    setLoading(true);
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

  //role change

  const handleRole = async (e) => {
    let payload = {
      team_uuid: params.uuid,
      role_type: e.target.value,
      user_uuid: e.target.id,
    };
    await axiosClient
      .post("/updateRole", payload)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const userInfo = async () => {
    await axiosClient
      .get("/getUserInfo")
      .then((res) => {
        setUserInfo(res.data.userInfo);
        setUserName(res.data.userInfo.username);
      })
      .catch((err) => {
        const response = err.response;
      });
  };

  const handleUserDetail = () => {
    let username = userName;
    if (username) {
      axiosClient
        .put(`http://localhost:4000/userUpdateProfile`, { username: username })
        .then(({ data }) => {
          showToastMessage(data.message);
        })
        .catch((err) => {
          const response = err.response;
          console.error("Error:", response.status);
        });
    } else {
      showToastErrorMessage("please fill the input field");
    }
  };

  return (
    <div>
      <TeamComponents
        team={teamName}
        setTeamName={setTeamName}
        handleUpdate={handleUpdate}
        message={message}
        handleInvite={handleInvite}
        invitePopup={invitePopup}
        setInvitePopup={setInvitePopup}
        teamMember={teamMembers}
        handleInviteUsers={handleInviteUsers}
        setInviteEmail={setInviteEmail}
        setRole={setRole}
        handleRole={handleRole}
        inviteError={inviteError}
        setInviteError={setInviteError}
        handleUserDetail={handleUserDetail}
        userInfos={userInfos}
        setUserInfo={setUserInfo}
        userName={userName}
        setUserName={setUserName}
      />

      <ToastContainer />

      {loading && (
        <>
          <div className="bg-primary opacity-[0.5] w-[1289px] h-[664px] absolute top-0 left-0  z-10"></div>
          <p className="absolute top-72 left-[600px] z-40">
            <HashLoader color="#3197e8" />
          </p>
        </>
      )}
    </div>
  );
};
