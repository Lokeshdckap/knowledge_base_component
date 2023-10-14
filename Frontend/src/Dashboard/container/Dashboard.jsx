import React, { useState } from 'react'
import Header from '../../common/commonLayouts/Header'
import SideNav from '../../common/commonLayouts/SideNav'
import SideNavLarge from '../../common/commonLayouts/SideNavLarge'

export default function Dashboard() {

  const [state,setState] = useState(false)

  const handleClick = () => {
    setState((prevState) => !prevState);

  }

  return (
    <div className='flex'>
      {/* <SideNav />
      <Header /> */}

      {state ? <SideNavLarge buttonClicked={handleClick} /> : <SideNav buttonClicked={handleClick} />}
      <Header />
    </div>
  )
}
