import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { ToastContainer, toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

export const TeamSetting = (props) => {
  const params = useParams();

  const [teamName, setTeamName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    team();
  }, [params]);

  const showToastErrorMessage = (data) => {
    toast.warning(data, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  const team = () => {
    axiosClient
      .get(`/api/teams/getTeam/${params.uuid}`)
      .then((res) => {
        setTeamName(res.data.Teams[0].name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUpdate = () => {
    if (teamName) {
      setLoading(true);
      axiosClient
        .post("/api/teams/updateTeamName", {
          uuid: params.uuid,
          name: teamName,
        })
        .then((res) => {
          setMessage(res.data.Success);
          setLoading(false);
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

  return (
    <div className="ml-28 mt-10">
      <div className="bg-white w-[900px] h-[550px]  shadow-md">
        <div className="w-[800px] m-auto">
          <p className="text-2xl font-bold text-textPrimary pt-10">
            Team Profile
          </p>
          <div className="mt-3">
            <label className="">Team Name</label>
            <div>
              <input
                type="text"
                value={(teamName && teamName) || ""}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded  block w-[500px] pl-2 p-2.5 focus:outline-primary mt-2"
                placeholder="Team Name"
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>
            <p className="text-green-700 pt-1">{message}</p>
          </div>
          <button
            className="bg-primary mt-5 h-12 w-48 text-white rounded text-center"
            onClick={handleUpdate}
          >
            update
          </button>
        </div>
        <ToastContainer />

        {loading && (
          <>
            <div className="bg-primary opacity-[0.5] w-screen h-[664px] absolute top-0 left-0  z-10"></div>
            <p className="absolute top-72 left-[600px] z-40">
              <HashLoader color="#3197e8" />
            </p>
          </>
        )}
      </div>
    </div>
  );
};
