import React, { useEffect, useState } from "react";
import { InviteUsers } from "../../common/commonLayouts/InviteUsers";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { ToastContainer, toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

export const ActiveUsers = (props) => {
  
  // let users = props.teamMember;
  const params = useParams();

  const [invitePopup, setInvitePopup] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");  
  const [role, setRole] = useState("");
  const [inviteError, setInviteError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    allUsers();
    team();
  }, [params]);

  let duration = 2000;

  const showToastMessage = (data) => {
    toast.success(data, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: duration,
      hideProgressBar: true,
      draggable: true,
      closeOnClick: true,
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

  const handleInvite = () => {
    setInvitePopup(true);
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
            if (response && response?.status === 400) {
              setInviteError(response.data);
              setTimeout(() => {
                setInviteError("");
              }, 1500);
              setLoading(false);
            } else {
              console.error("Error:", response?.status);
            }
          });
      }
    };


  return (
    <div className='ml-24 mt-5'>
      <div className="bg-white w-[900px] h-[550px] shadow-md overflow-auto">
        <div className="w-[850px] m-auto">
          <p className="text-textPrimary text-2xl pt-5 font-semibold">
            Active Users
          </p>
          <div className="flex justify-between mt-3 items-center">
            <p className="font-semibold">Current Users</p>
            <div className="">
              <button
                type="button"
                className="text-primary hover:text-white border border-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-7 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
                onClick={handleInvite}
              >
                Invite users
              </button>
            </div>
          </div>
          <hr className="text-gray-400 mt-2" />
          <div>
            <input
              type="search"
              id="default-search"
              className="block w-36 p-2 pl-2 text-sm border border-gray-300 rounded-lg  focus:outline-primary mt-2 "
              placeholder="search here"
              required
            />
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                
                {teamMembers &&
                  teamMembers.map((user) => (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={user.uuid}>
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {user.username}
                      </th>
                      <td className="px-6 py-4">{user.email}</td>
                      {user.user_team_members &&
                        user.user_team_members.map((member) => {
                          if (member.role_id == 1) {
                            return (
                              <td className="px-6 py-4"
                              key={member.user_uuid}
                              >

                                <select
                                  name=""
                                  id={member.user_uuid}
                                  className="focus:outline-none"
                                  onChange={handleRole}
                                  key={member.user_uuid}
                                >
                                  <option value="1">admin</option>
                                  <option value="2">viewer</option>
                                  <option value="3">editor</option>
                                </select>
                              </td>
                            );
                          } else if (member.role_id == 2) {
                            return (
                              <td className="px-6 py-4"
                              key={member.user_uuid}
                              >

                                <select
                                  name=""
                                  id={member.user_uuid}
                                  className="focus:outline-none"
                                  onChange={handleRole}
                                  key={member.user_uuid}

                                >
                                  <option value="2">viewer</option>
                                  <option value="3">editor</option>
                                  <option value="1">admin</option>
                                </select>
                              </td>
                            );
                          } else if (member.role_id == 3) {
                            return (
                              <td className="px-6 py-4"
                              key={member.user_uuid}
                              >
                                <select
                                  name=""
                                  id={member.user_uuid}
                                  className="focus:outline-none"
                                  onChange={handleRole}
                                  key={member.user_uuid}

                                >
                                  <option value="3">editor</option>
                                  <option value="1">admin</option>
                                  <option value="2">viewer</option>
                                </select>
                              </td>
                            );
                          }
                        })}
                      <td className="px-6 py-4">
                        <a
                          href="#"
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        >
                          Remove{" "}
                        </a>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {invitePopup && (
        <InviteUsers
          setInvitePopup={setInvitePopup}
          team={teamName}
          handleInviteUsers={handleInviteUsers}
          setInviteEmail={setInviteEmail}
          setRole={setRole}
          inviteError={inviteError}
          setInviteError={setInviteError}
        />
      )}
    </div>
  );
};
