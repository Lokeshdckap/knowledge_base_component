import React from 'react'
import { TrashHeader } from '../../common/commonLayouts/TrashHeader'
import { TrashMain } from '../../common/commonLayouts/TrashMain'

export const TrashComponent = (props) => {
  return (
    <div>
        <TrashHeader 
        widths={props.widths}

        />
        <TrashMain 
        
        />
    </div>
  )
}
