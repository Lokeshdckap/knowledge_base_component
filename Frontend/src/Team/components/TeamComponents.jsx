import React from "react";
import { TeamSideNav } from "../../common/commonLayouts/TeamSideNav";
import { TeamProfile } from "../../common/commonLayouts/TeamProfile";
import { useParams } from "react-router-dom";
import { ActiveUsers } from "../../common/commonLayouts/ActiveUsers";

export const TeamComponents = (props) => {
    const params = useParams();

    
  return (
    <div className="flex bg-[#F4F4F4] h-screen overflow-auto">
      <TeamSideNav
        team={props.team}
        setTeamName={props.setTeamName}
        handleUpdate={props.handleUpdate}
        message={props.message}
      />

      <div className="m-auto">
        {params.slug == "teamsetting" ? (
          <TeamProfile
          team={props.team}
            setTeamName={props.setTeamName}
            message={props.message}
            handleUpdate={props.handleUpdate}
          />
        ) : (
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
        )}

      </div>
   
      
    </div>
  );
};
