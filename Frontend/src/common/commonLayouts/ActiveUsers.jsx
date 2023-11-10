import React from "react";
import { InviteUsers } from "./InviteUsers";

export const ActiveUsers = (props) => {
  let users = props.teamMember;
  return (
    <div>
      <div className="bg-white w-[900px] h-[550px] shadow-md mt-5 overflow-auto">
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
                onClick={props.handleInvite}
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
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {console.log(users)}
                {users &&
                  users.map((user) => (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
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
                            return <td className="px-6 py-4">admin</td>;
                          } else if (member.role_id == 2) {
                            return <td className="px-6 py-4">Viewer</td>;
                          } else {
                            return <td className="px-6 py-4">editor</td>;
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
      {props.invitePopup && (
        <InviteUsers
          setInvitePopup={props.setInvitePopup}
          teamname={props.teamname}
          handleInviteUsers={props.handleInviteUsers}
          setInviteEmail={props.setInviteEmail}
          setRole={props.setRole}
        />
      )}
    </div>
  );
};
