import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';




export const PageTree = ({ node, isLast,contentPage,handleScriptMouseEnter,handleScriptMouseLeave,hoverPageId,handleMore }) => {
  

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };






  return (
    <div className="mb-1">
      <div className="flex items-center">
        <div className="w-4 h-4   ">
          {/* {!isLast ? (
            <div className="border-l border-gray-500 absolute left-1 top-4 h-full"></div>
          ) : null} */}
        </div>
        <button className="text-sm mr-2" onClick={toggleOpen}>
          {isOpen ? (
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronUpIcon className="w-4 h-4 text-gray-500" />
          )}
        </button>
        <span className="text-lg font-semibold" 
          onMouseEnter={handleScriptMouseEnter}
          onMouseLeave={handleScriptMouseLeave}
          onClick={contentPage} id={node.uuid}
        
        >{node.title}
        {hoverPageId == node.uuid && (

                <i className="fa-solid fa-ellipsis-vertical text-[#BCD1FF] pl-6" id={node.uuid} onClick={handleMore}></i>
              )}
        
        </span>
      </div>
      {isOpen && node.ChildPages && node.ChildPages.length > 0 && (
        <ul className="ml-4">
          {node.ChildPages.map((child, index) => (
            <li key={child.page_id}  onClick={contentPage} className="" 
            >
              <PageTree node={child} isLast={index === node.ChildPages.length - 1} />
            </li>
          ))}
        </ul>
      )}
    </div>




    // <div>
    //   <div className="flex items-center bg-white w-[240px] h-10 text-xl text-primary mt-2">
    //     <button className="text-sm p-1" onClick={toggleOpen}>
    //       {isOpen && node.ChildPages.length > 0 ? (
            
    //         <ChevronUpIcon className="w-4 h-4" />
    //       ) : (
    //         node.ChildPages.length > 0 &&(
    //         <ChevronDownIcon className="w-4 h-4" />
    //         )

    //       )}
    //     </button>
    //     <span className="">{node.title}</span>
    //   </div>
    //   {isOpen && node.ChildPages && node.ChildPages.length > 0 && (
    //     <ul className="ml-4">
    //       {node.ChildPages.map((child) => (
    //         <li key={child.page_uuid} >
    //           <PageTree node={child} />
    //         </li>
    //       ))}
    //     </ul>
    //   )}
    // </div>
  );
};


{/* <div 
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


</div>  */}