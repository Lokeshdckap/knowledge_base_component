import React from "react";
import { TeamSideNav } from "../../common/commonLayouts/TeamSideNav";
import { TeamProfile } from "../../common/commonLayouts/TeamProfile";
import { useParams } from "react-router-dom";
import { ActiveUsers } from "./ActiveUsers";
import Error from "../../Error/Error";
import { Profile } from "./Profile";

export const TeamComponents = (props) => {
  const params = useParams();

  return (
    <div className="flex ">
      <TeamSideNav
        team={props.team}
        setTeamName={props.setTeamName}
        handleUpdate={props.handleUpdate}
        message={props.message}
      />

      <div className="">
        {params.slug == "teamsetting" ? (
          <TeamProfile
            team={props.team}
            setTeamName={props.setTeamName}
            message={props.message}
            handleUpdate={props.handleUpdate}
          />
        ) : params.slug === "activeusers" ? (
          <ActiveUsers
            team={props.team}
            handleInvite={props.handleInvite}
            invitePopup={props.invitePopup}
            setInvitePopup={props.setInvitePopup}
            teamMember={props.teamMember}
            handleInviteUsers={props.handleInviteUsers}
            setInviteEmail={props.setInviteEmail}
            setRole={props.setRole}
            handleRole={props.handleRole}
            inviteError={props.inviteError}
            setInviteError={props.setInviteError}
          />
        ) : params.slug === "profile" ? (
          <Profile
            userInfos={props.userInfos}
            handleUserDetail={props.handleUserDetail}
            setUserInfo={props.setUserInfo}
            userName={props.userName}
            setUserName={props.setUserName}
          />
        ) : (
          <Error />
        )}
      </div>
    </div>
  );
};
