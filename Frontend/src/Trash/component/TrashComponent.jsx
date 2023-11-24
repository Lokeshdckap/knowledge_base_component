import React from 'react'
import { TrashHeader } from '../../common/commonLayouts/TrashHeader'
import { TrashMain } from '../../common/commonLayouts/TrashMain'

export const TrashComponent = (props) => {
  return (
    <div className="bg-[#F9FAFB] h-screen w-screen overflow-auto z-[10px]">
        <TrashHeader 
        />
        <TrashMain 
          trashData={props.trashData}
        />
    </div>
  )
}
