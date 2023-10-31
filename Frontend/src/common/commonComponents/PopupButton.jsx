import React from 'react'

export const PopupButton = (props) => {
  return (
    <div className={`text-center`}>
        <button class="bg-primary hover:bg-cyan-950 text-white font-bold py-3 px-20 rounded"
            onClick={props.createTeam}
        >   
            Create Team
        </button>
    </div>
  )
}
