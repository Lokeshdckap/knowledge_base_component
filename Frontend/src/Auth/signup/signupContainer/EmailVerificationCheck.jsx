import React, { useEffect, useState } from "react";
import HashLoader from "react-spinners/HashLoader";
import axiosClient from "../../../axios-client";
import { useNavigate, useParams } from "react-router-dom";
import { useStateContext } from "../../../context/ContextProvider";

export const EmailVerificationCheck = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { auth, setAuth } = useStateContext();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    if (params.uuid && params.token) {
      axiosClient
        .get(
          `http://localhost:4000/api/auth/verify-email/${params.uuid}/${params.token}`
        )
        .then(({ data }) => {
          if (data.userTeamAvailable) {
            setAuth({
              token: auth,
              verify: data.verify,
              state: true,
            });
          } else {
            setAuth({
              token: auth,
              verify: data.verify,
            });
          }
          setLoading(false);
        })

        .catch((err) => {
          console.error("Axios error:", err);

          const response = err.response;
          if (response && response?.status === 409) {
            navigate("/signin");
          } else {
            console.error("Error:", response?.status);
          }
        })
        .finally(() => {
          console.log("Finally block, setLoading(false)");
          setLoading(false);
        });
    } else {
      console.log("Token Is Not Valid Please Click Again the Link");
      setLoading(false);
    }
  }, [params.uuid, params.token]);

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
