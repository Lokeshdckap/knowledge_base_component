import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axiosClient from "../axios-client";

export const JoinTeam = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [decodedToken, setDecodedToken] = useState(null);
  let hasEffectRun = false;
  useEffect(() => {
    if (!hasEffectRun) {
      const decoded = jwtDecode(params.token);
      let payLoad = {
        id: decoded.id,
        team_uuid: decoded.team_uuid,
        role: decoded.role,
      };

      if (decoded.id) {
        let payLoad = {
          id: decoded.id,
          team_uuid: decoded.team_uuid,
          role: decoded.role,
          isProgress:1
        };
        axiosClient
          .post("/api/invites/updateInvite", payLoad)
          .then((res) => {

            navigate("/dashboard");
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        localStorage.setItem("inviteInfo", JSON.stringify(decoded));
        navigate("/signup");
      }
      hasEffectRun = true;
    }
  }, []);

  return <div>Loading....</div>;
};
