import React from 'react'
import { TrashComponent } from '../component/TrashComponent'


export const Trash = (props) => {
    console.log(props);
  return (
    <div>
        <TrashComponent 
        widths={props.widths}
        
        />
    </div>
  )
}
