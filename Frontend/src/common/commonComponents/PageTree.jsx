import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import { useParams } from "react-router-dom";

export const PageTree = ({
  node,
  hasSibling,
  contentPage,
  handleScriptMouseEnter,
  handleScriptMouseLeave,
  hoverPageId,
  handleMore,
  hasParent,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  const { slug, '*': wildcardValue } = useParams();


  
  
  return (
    <div className="mb-1">
      <div
        className={`flex items-center hover:bg-slate-300   ${"/"+slug+"/"+wildcardValue == node.path ? "bg-slate-300 " : "" }  rounded hover:rounded pl-2`}
        data-set={node.path}
      >
        <span
          className="text-[18px]  cursor-pointer pt-1 pb-1 w-[100%]"
          onMouseEnter={handleScriptMouseEnter}
          onMouseLeave={handleScriptMouseLeave}
          onClick={contentPage}
          id={node.uuid}
          data-set={node.path}
          key={node.id}
        >
          {node.title}
          {hoverPageId == node.uuid && (
            <i
              className="fa-solid fa-plus text-[#57595c] pl-6"
              id={node.uuid}
              onClick={handleMore}
            ></i>
          )}
        </span>
        <button className="text-sm mr-2" onClick={toggleOpen}>
          {isOpen ? (
            <i className="fa-solid fa-angle-down cursor-pointer "></i>
          ) : (
            <i className="fa-solid fa-angle-up cursor-pointer rotate-90"></i>
          )}
        </button>
      </div>
      {isOpen && node.ChildPages && node.ChildPages.length > 0 && (
        <ul className="ml-3 mt-1 pl-1 border-l-[1px] border-gray-400">
          {node.ChildPages.map((child, index) => (
            <li key={child.page_id} className="cursor-pointer" id={child.uuid}>
              <PageTree
                node={child}
                hasSibling={index < node.ChildPages.length - 1}
                hasParent={true}
                handleScriptMouseEnter={handleScriptMouseEnter}
                handleScriptMouseLeave={handleScriptMouseLeave}
                hoverPageId={hoverPageId}
                contentPage={contentPage}
                handleMore={handleMore}
              />
            </li>
          ))}
        </ul>
      )}
    </div>


    // <div className="mb-1">
    //   <div className="flex items-center">
    //     <div className="w-4 h-4   ">
    //       {/* {!isLast ? (
    //         <div className="border-l border-gray-500 absolute left-1 top-4 h-full"></div>
    //       ) : null} */}
    //     </div>
    //     <button className="text-sm mr-2" onClick={toggleOpen}>
    //       {isOpen ? (
    //         <ChevronDownIcon className="w-4 h-4 text-gray-500" />
    //       ) : (
    //         <ChevronUpIcon className="w-4 h-4 text-gray-500" />
    //       )}
    //     </button>
    //     <span className="text-lg font-semibold"
    //       onMouseEnter={handleScriptMouseEnter}
    //       onMouseLeave={handleScriptMouseLeave}
    //       onClick={contentPage} id={node.uuid}

    //     >{node.title}
    //     {hoverPageId == node.uuid && (

    //             <i className="fa-solid fa-ellipsis-vertical text-[#BCD1FF] pl-6" id={node.uuid} onClick={handleMore}></i>
    //           )}

    //     </span>
    //   </div>
    //   {isOpen && node.ChildPages && node.ChildPages.length > 0 && (
    //     <ul className="ml-4">
    //       {node.ChildPages.map((child, index) => (
    //         <li key={child.page_id}  onClick={contentPage} className="cursor-pointer bg-white h-10 mt-2 pt-1"
    //         >
    //           <PageTree node={child} isLast={index === node.ChildPages.length - 1} />
    //         </li>
    //       ))}
    //     </ul>
    //   )}
    // </div>

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
    //   );
    // };
  );
};

{
  /* <div 
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


</div>  */
}
