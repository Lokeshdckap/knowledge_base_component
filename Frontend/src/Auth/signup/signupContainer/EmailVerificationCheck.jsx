import React, { useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader";
import axiosClient from "../../../axios-client";
import { useParams } from "react-router-dom";
import { useStateContext } from "../../../context/ContextProvider";

export const EmailVerificationCheck = () => {
  const params = useParams();
  const { setAuth } = useStateContext();

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    setLoading(true);
    if (params.uuid && params.token) {
      axiosClient
        .get(
          `http://localhost:4000/verify-email/${params.uuid}/${params.token}`
        )
        .then(({ data }) => {
            console.log(data);
          if (data.userTeamAvailable) {
            setAuth({
              token: data.jwttoken,
              verify: data.verify,
              state: true,
            });
            setLoading(false);
          } 
          else {
            setAuth({
              token: data.jwttoken,
              verify: data.verify,
            });
            setLoading(false);
          }
          setLoading(false);
        })
        .catch((err) => {
          // debugger;
        });
    } else {
      console.log("Token Is Not Valid Please Click Again the Link");
    }
  }, []);
  return (
    <div>
      {loading && (
        <p className="absolute top-72 left-[600px]">
          <HashLoader color="#3197e8" />
        </p>
      )}
    </div>
  );
};
