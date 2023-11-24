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

  const [inviteError, setInviteError] = useState(null);
  const [role, setRole] = useState("");
  const params = useParams();

  useEffect(() => {
    team();
    allUsers();
  }, [params]);

  const showToastMessage = (data) => {
    toast.success(data, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const team = () => {
    
    axiosClient
      .get(`/getTeam/${params.uuid}`)
      .then((res) => {

        setTeamName(res.data.name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const allUsers = () => {
    // console.log(params.uuid);
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
  };

  const handleInvite = () => {
    setInvitePopup(true);
  };

  const handleInviteUsers = () => {

    setLoading(true);
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

  //role change

  const handleRole = async (e) => {
    let payload = {
      team_uuid: params.uuid,
      role_type: e.target.value,
      user_uuid: e.target.id,
    };
    console.log(payload);
    await axiosClient
      .post("/updateRole", payload)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
      />

      <ToastContainer />

      {loading && (
        <p className="absolute top-72 left-[600px] z-40">
          <HashLoader color="#3197e8" />
        </p>
      )}
    </div>
  );
};
