import React, { useEffect, useRef, useState } from "react";
import { EditorComponents } from "../commonComponents/EditorComponents";
// import EditorJS from "@editorjs/editorjs";
// import Header from '@editorjs/header'; 
// import List from '@editorjs/list';
// import SimpleImage from '@editorjs/simple-image';
// import ImageTool from '@editorjs/image';

export default function EditPage(props) {


  const [newPagePopup, setNewPagePopup] = useState(false);
  const [OverPage,setOverPage] = useState(null)
  const [renderPage,setRenderPage] = useState([
          {
            "id":1,
            "title":"Page"
          },
          {
            "id":2,
            "title":"Page"
          },
          {
            "id":3,
            "title":"Page"
          }

])



const handleMouseEnter = (e) => {
  let targetId = e.target.id;
  setOverPage(targetId);
};

const handleMouseLeave = () => {
  setOverPage(null);
};


  const handlePopupPage = () =>{
    setNewPagePopup((prevState) => !prevState);
  }

  return (
    <div>
      <div className="mt-14 flex">
        <div className="bg-[#E4E8EC] w-[278px] h-[500px]">
          
          <div className="space-y-2 ml-4 mt-4">

            {renderPage &&
              renderPage.map((page) => 
               <div 
               className="bg-white w-[240px] h-10 text-xl text-primary pl-2 pt-1  cursor-pointer m-auto " 
               onMouseEnter={handleMouseEnter}
               onMouseLeave={handleMouseLeave}
               id={page.id}
               >
                  <p id={page.id} className="flex justify-between">
                    <span>{page.title}</span>
                    {OverPage == page.id &&
                   <i
                    className="fa-solid fa-ellipsis-vertical text-slate-400 pr-4 pt-[6px]"
                    id={page.id}
                  ></i>
                }
                  </p>
               
               
              </div> 

              )
            } 
          </div>
          <hr
            className={`h-px w-[250px] bg-[#D5D7DA] border-0 m-auto dark:bg-gray-900 mt-4`}
          />
          <div>
            <div >
              <p className="text-xl cursor-pointer text-[#90979D] pl-5 pt-3" onClick={handlePopupPage}>
              <i class="fa-regular fa-file" onClick={handlePopupPage}></i> New Page
              </p>
            </div>
            {newPagePopup && (
              <div className="box-border bg-white h-28 w-56 p-4 mt-1 border-[1px] m-auto rounded shadow-lg ">
                <p className="text-lg mb-2 pl-2 cursor-pointer">
                  <i className="fa-regular fa-file pr-2 ml-6"></i>New Page
                </p>
                <hr
                  className={`h-px  bg-[#D5D7DA] border-0 dark:bg-gray-900 `}
                />
                <p className="text-lg mt-2 pl-2 cursor-pointer">
                  <i className="fa-regular fa-file pr-2 ml-6"></i>New Group
                </p>
              </div>
            )}

            <div></div>
          </div>
        </div>
        <div className={`bg-white h-[510px] ${props.widths} overflow-auto`}>
          <div>
              <input className="text-2xl ml-[80px] mt-8 focus:outline-none text-textPrimary font-bold" onChange={props.handleTitle} placeholder="Page Name"/>
          </div>
          <div>
              <input className="text-xl ml-[80px] mt-5 focus:outline-none text-textPrimary " placeholder="Page Description" onChange={props.handleDescription}/>
          </div>


            <div className={`pt-5 ${props.marginEditor}`}>
              <EditorComponents getValue = {props.getValue} editorState={props.editorContent}/>
              {/* <button onClick={cliked}>Save</button> */}
            </div>
        </div>
      </div>

    </div>
    
  );
}
