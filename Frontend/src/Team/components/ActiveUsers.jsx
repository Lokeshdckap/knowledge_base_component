import React, { useEffect, useState } from "react";
import { InviteUsers } from "../../common/commonLayouts/InviteUsers";
import { useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { ToastContainer, toast } from "react-toastify";
import HashLoader from "react-spinners/HashLoader";

export const ActiveUsers = (props) => {
  const params = useParams();

  const [invitePopup, setInvitePopup] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [role, setRole] = useState("");
  const [inviteError, setInviteError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assignrole, setAssignRole] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  
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
    setIsLoading(true);
    axiosClient
      .get(`/api/teams/getAciveUsers/${params.uuid}`)
      .then((res) => {
        setIsLoading(false);

        setTeamMembers(res.data.userDetail);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const team = () => {
    axiosClient
      .get(`/api/teams/getTeam/${params.uuid}`)
      .then((res) => {
        setTeamName(res.data.Teams[0].name);
        setAssignRole(res.data.team_member.role_id);
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
    setIsLoading(true)
    let payload = {
      team_uuid: params.uuid,
      role_type: e.target.value,
      user_uuid: e.target.id,
    };
    await axiosClient
      .post("/api/invites/updateRole", payload)
      .then((res) => {
        setIsLoading(false)

        showToastMessage(res.data.message);
      })
      .catch((err) => {
        setIsLoading(false)
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
        .post("/api/invites/inviteUsers", {
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

  const searchUsers = async (e) => {
    let value = e.target.value;
    setIsLoading(true);

    await axiosClient
      .get(`/api/teams/${params.uuid}/search/users?q=${value}`)
      .then((res) => {
        setIsLoading(false);
        setTeamMembers(res.data.userDetail);
      })
      .catch((err) => {
        const response = err.response;

        if (response) {
          if (response.status === 404) {
            setTeamMembers(response.data.msg);
            setIsLoading(false);
          } else {
            console.error("Non-404 error occurred. Response:", response);
          }
        } else {
          console.error("An unexpected error occurred:", err);
        }
      });
  };

  const handleRemove = async (e) => {
    setIsLoading(true);

    let targetId = e.target.id;
    let payload = {
      "uuid" : targetId,
      "team_uuid" : params.uuid
    }

    if (targetId) {
      await axiosClient
        .delete(`/api/teams/removeUserFromTeam`,payload)
        .then((res) => {
          showToastMessage(res.data.msg);
          setIsLoading(false);
          allUsers()
        })
        .catch((err) => {
          const response = err.response;

          if (response) {
            if (response.status === 404) {
              setTeamMembers(response.data.msg);
              setIsLoading(false);
            } else {
              console.error("Non-404 error occurred. Response:", response);
              setIsLoading(false);
            }
          } else {
            console.error("An unexpected error occurred:", err);
            setIsLoading(false);
          }
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="m-auto">
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
                disabled={assignrole == 2 ? true : false}
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
              className="w-36 p-2 pl-2 text-sm border border-gray-300 rounded-lg  focus:outline-none  mt-2 "
              placeholder="search here"                              
              onChange={searchUsers}
              autoComplete="off"
              required
            />
          </div>
          <div className="relative  shadow-md sm:rounded-lg mt-5">
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
                  {assignrole == 1 && (
                    <th scope="col" className="px-6 py-3">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="text-center">
                      <div role="status" className="py-[50px]">
                        <div role="status" className="py-[50px]" colSpan={4}>
                          <svg
                            aria-hidden="true"
                            className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : teamMembers && teamMembers.length > 0 ? (
                  teamMembers.map((user) => (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      key={user.uuid}
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {user.username}
                      </th>
                      <td className="px-6 py-4">{user.email}</td>
                      {user.user_team_members &&
                        user.user_team_members.map((member) => {
                          return assignrole === 1 ? (
                            <td className="px-6 py-4" key={member.user_uuid}>
                              {member?.role_id === 1 ? (
                                <option value="1" className="font-semibold">
                                  Admin
                                </option>
                              ) : (
                                <select
                                  name=""
                                  id={member.user_uuid}
                                  className="focus:outline-none"
                                  onChange={handleRole}
                                  key={member.user_uuid}
                                >
                                  {member?.role_id === 2 && (
                                    <>
                                      <option value="2">Viewer</option>
                                      <option value="3">Editor</option>
                                    </>
                                  )}
                                  {member?.role_id === 3 && (
                                    <>
                                      <option value="3">Editor</option>
                                      <option value="2">Viewer</option>
                                    </>
                                  )}
                                </select>
                              )}
                            </td>
                          ) : (
                            <td
                              className="px-6 py-4 font-semibold"
                              key={member?.user_uuid}
                            >
                              {member?.role_id === 3 && (
                                <option className="font-semibold" value="3">
                                  Editor
                                </option>
                              )}
                              {member?.role_id === 2 && (
                                <option className="font-semibold" value="2">
                                  Viewer
                                </option>
                              )}
                              {member?.role_id === 1 && (
                                <option value="1" className="font-semibold">
                                  Admin
                                </option>
                              )}
                            </td>
                          );
                        })}
                      {user.user_team_members &&
                        user.user_team_members.map((member) => {
                          return (
                            assignrole === 1 && (
                              <td className="px-6 py-4" key={member.user_uuid}>
                                {member?.role_id === 1 ? (
                                  <option
                                    value="1"
                                    className="font-semibold  pl-5"
                                  >
                                    -
                                  </option>
                                ) : (
                                  <>                                 
                                    <p
                                      className="font-medium text-red-400 dark:text-red-400 hover:underline cursor-pointer"
                                      onClick={handleRemove}
                                      id={user.uuid}
                                    >
                                      Remove
                                    </p>
                                  </>
                                )}
                              </td>
                            )
                          );
                        })}

                      {/* assignrole == 1 && (
                        <td className="px-6 py-4"> */}
                      {/* {user.user_team_members &&
                            user.user_team_members.map((member) => { */}
                      {
                        //   member?.role_id === 1 ? (
                        //     <option value="1" className="font-semibold">
                        //       Nothing
                        //     </option>
                        //   ) : (
                        // <p
                        //   className="font-medium text-red-400 dark:text-red-400 hover:underline cursor-pointer"
                        //   onClick={handleRemove}
                        // >
                        //   Remove
                        // </p>
                        // );
                        // }
                        // })}
                      }
                      {/* </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      <div role="status" className="py-[50px]">
                        <p>No Records Found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>

              {/* {loading ? (
                <tbody>
                  <tr>
                    <td colSpan="4" className="text-center">
                      <div role="status" className="py-[50px]" colspan="4">
                        <svg
                          aria-hidden="true"
                          className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {teamMembers ? (
                    teamMembers.map((user) => (
                      <tr
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        key={user.uuid}
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {user.username}
                        </th>
                        <td className="px-6 py-4">{user.email}</td>
                        {user.user_team_members &&
                          user.user_team_members.map((member) => {
                            return assignrole === 1 ? (
                              <td className="px-6 py-4" key={member.user_uuid}>
                                {member?.role_id === 1 ? (
                                  <option value="1" className="font-semibold">
                                    Admin
                                  </option>
                                ) : (
                                  <select
                                    name=""
                                    id={member.user_uuid}
                                    className="focus:outline-none"
                                    onChange={handleRole}
                                    key={member.user_uuid}
                                  >
                                    {member?.role_id === 2 && (
                                      <>
                                        <option value="2">Viewer</option>
                                        <option value="3">Editor</option>
                                      </>
                                    )}
                                    {member?.role_id === 3 && (
                                      <>
                                        <option value="3">Editor</option>
                                        <option value="2">Viewer</option>
                                      </>
                                    )}
                                  </select>
                                )}
                              </td>
                            ) : (
                              <td
                                className="px-6 py-4 font-semibold"
                                key={member?.user_uuid}
                              >
                                {member?.role_id === 3 && (
                                  <option className="font-semibold" value="3">
                                    Editor
                                  </option>
                                )}
                                {member?.role_id === 2 && (
                                  <option className="font-semibold" value="2">
                                    Viewer
                                  </option>
                                )}
                                {member?.role_id === 1 && (
                                  <option value="1" className="font-semibold">
                                    Admin
                                  </option>
                                )}
                              </td>
                            );
                          })}
                        {assignrole == 1 && (
                          <td className="px-6 py-4">
                            <a
                              href="#"
                              className="font-medium text-red-400 dark:text-red-400 hover:underline"
                            >
                              Remove
                            </a>
                          </td>
                        )}
                      </tr>
                    ))
               
                </tbody>   ) : (
                  <tbody>
                  
                  <tr>
                    <td colSpan="4" className="text-center">
                      <div role="status" className="py-[50px]" colspan="4">
                        <p>No Records Found</p>
                      </div>
                    </td>
                  </tr>
              </tbody>
              )}
              )} */}
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
       <ToastContainer />
      {loading && (
        <>
          <div className="bg-[#aeaeca] opacity-[0.5] w-[100%] h-[100vh] absolute top-0 left-0  z-10"></div>
          <div className="">
            <p className="absolute top-[48%] left-[48%] z-50">
              <HashLoader color="#3197e8" />
            </p>
          </div>
        </>
      )}
    </div>
  );
};
