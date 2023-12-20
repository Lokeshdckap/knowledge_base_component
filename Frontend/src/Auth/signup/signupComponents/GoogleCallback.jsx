import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "../../../context/ContextProvider";
import axiosClient from "../../../axios-client";
function GoogleCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({});
  const { auth, setAuth } = useStateContext();
  useEffect(() => {
    // let inviteDetail = JSON.parse(localStorage.getItem("inviteInfo"));
    // console.log(inviteDetail);
    // setFormValues({
    //   team_uuid: inviteDetail,
    //   role: inviteDetail.role,
    // });
    axiosClient
      .get(`http://localhost:4000/api/auth/google/callback${location.search}`)
      .then(({ data }) => {
        console.log(data);
        if (data.access_token) {
          setAuth({
            token: data.access_token,
            refresh_token:data.refresh_token,
            verify: data.verify,
          });
        } else {
          localStorage.removeItem("ACCESS_TOKEN");
        }
      })
      .catch((err) => {
        const response = err.response;
        if (response && response?.status === 500) {
           if(response.data.Error){
            console.log(response.data.Error);
            localStorage.setItem('errorMessage', response.data.Error);
            navigate('/signup')
           }
        }
      });
  }, []);
}

export default GoogleCallback;
