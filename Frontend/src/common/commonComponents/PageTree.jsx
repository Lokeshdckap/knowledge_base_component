import React, { useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const PageTree = ({
  node,
  hasSibling,
  contentPage,
  handleScriptMouseEnter,
  handleScriptMouseLeave,
  hoverPageId,
  handleMore,
  hasParent,
  index,
  parentOpen,
}) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageIds = queryParams.get("pageId");

  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [parentOpens,setParentOpen] = useState(parentOpen);
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  const { slug, "*": wildcardValue } = useParams();

  

  return (
    <div className="mb-1">
      <div
        className={`flex items-center hover:bg-slate-300 ${
          pageIds == node.uuid ? "bg-slate-300 " : ""
        }  ${
          "/" + slug + "/" + wildcardValue == node.path ? "bg-slate-300 " : ""
        }  rounded hover:rounded pl-2`}
        data-set={node.path}
      >
        <span
          className="text-[18px]  cursor-pointer pt-1 pb-1 w-[100%]"
          onMouseEnter={handleScriptMouseEnter}
          onMouseLeave={handleScriptMouseLeave}
          onClick={contentPage}
          id={node.uuid}
          data-set={node.path}
          index={node.id}
          key={node.id}
        >
          {node.title.slice(0,-5)}
          {hoverPageId == node.uuid && (
            <i
              className="fa-solid fa-plus text-[#57595c] pl-6"
              id={node.uuid}
              onClick={handleMore}
            ></i>
          )}
        </span>
        <button className="text-sm mr-2" onClick={toggleOpen}>
          {isOpen || node.uuid == parentOpens ? (
            <i className="fa-solid fa-angle-down cursor-pointer "></i>
          ) : (
            <i className="fa-solid fa-angle-up cursor-pointer rotate-90"></i>
          )}
        </button>
      </div>
      {(node.uuid == parentOpens || isOpen)  && node.ChildPages && node.ChildPages.length > 0 && (
        <ul className="ml-3 mt-1 pl-1 border-l-[1px] border-gray-400">
          {node.ChildPages.map((child, index) => (
            <li
              key={child.page_id}
              className="cursor-pointer"
              data-id={index}
              id={child.uuid}
            >
              <PageTree
                node={child}
                index={index}
                hasSibling={index < node.ChildPages.length - 1}
                hasParent={true}
                handleScriptMouseEnter={handleScriptMouseEnter}
                handleScriptMouseLeave={handleScriptMouseLeave}
                hoverPageId={hoverPageId}
                contentPage={contentPage}
                handleMore={handleMore}
                parentOpen={parentOpens}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
