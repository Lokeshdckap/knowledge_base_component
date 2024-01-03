import React, { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/solid";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const PageTree = ({
  node,
  pageCount,
  contentPage,
  handleScriptMouseEnter,
  handleScriptMouseLeave,
  hoverPageId,
  handleMore,
  parentOpen,
  role,
  setHoverPageId,
  popUp,
  setPopUp,
  handlePageDelete,
  treeNodes,
  inputStr,
}) => {
  const addIconRef = useRef(null);
  const addPopup = useRef(null);

  const [topState, setTopState] = useState(null);

  //Page Popup
  const addPopUp = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const element = addIconRef.current;
    // Check if the element is available
    if (element) {
      // Use getBoundingClientRect to get the size and position
      const top = element.getBoundingClientRect().top;
      const left = element.getBoundingClientRect().left;

      setTopState({
        top: top + 30,
        left: left,
      });
    }

    let targetId = e.target.id;
    localStorage.setItem("mainId", targetId);
    setPopUp(targetId);
  };

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pageIds = queryParams.get("pageId");

  const params = useParams();

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    if (parentOpen) {
      setIsOpen(parentOpen.includes(node.uuid));
    }
    const closeOnOutsideClick = (e) => {
      if (
        popUp &&
        addPopup.current &&
        !addPopup.current.contains(e.target) &&
        e.target !== addIconRef.current
      ) {
        setPopUp(null);
        setHoverPageId(null);
        if (localStorage.getItem("mainId")) {
          localStorage.removeItem("mainId");
        }
      }
    };
    
    window.addEventListener("click", closeOnOutsideClick);

    return () => {
      window.removeEventListener("click", closeOnOutsideClick);
    };
  }, [parentOpen, node.uuid, popUp]);

  const { slug, "*": wildcardValue } = useParams();

  return (
    <div
      className="mb-1 "
      id={node.uuid}
      key={node.uuid}
      onMouseEnter={handleScriptMouseEnter}
      onMouseLeave={handleScriptMouseLeave}
    >
      <div
        key={node.uuid}
        className={`flex items-center hover:bg-[#d5dde6] ${
          pageIds == node.uuid ? "bg-[#d5dde6] " : ""
        }  ${
          "/" + slug + "/" + wildcardValue == node.path ? "bg-[#f0f3f7] font-medium" : ""
        }
        
        rounded hover:rounded pl-2 phone:pl-px`}
        data-set={node.path}
        onMouseEnter={handleScriptMouseEnter}
        onMouseLeave={handleScriptMouseLeave}
      >
        {node?.emoji && (
          <img
            className="cursor-pointer w-[18px] mr-1"
            src={node?.emoji ? node?.emoji : ``}
          />
        )}
        <span
          className={`text-[18px] phone:text-[14px]   font-inter text-base cursor-pointer pt-1 pl-2 pb-1 w-[100%] ${
            "/" + slug + "/" + wildcardValue == node.path ? "font-medium " : ""
          }`}
          onClick={contentPage}
          id={node.uuid}
          data-set={node.path}
          index={node.id}
          key={node.uuid}
        >
          {node.title.split("-")[0]}
        </span>
        {role == 2
          ? ""
          : hoverPageId == node.uuid && (
              <i
                className="fa-solid fa-ellipsis-vertical cursor-pointer  pr-5"
                id={node.uuid}
                onClick={addPopUp}
                ref={addIconRef}
              ></i>
            )}
        {node.ChildPages.length > 0 && (
          <button className="text-sm mr-2 " onClick={toggleOpen}>
            {isOpen ? (
              <i
                className="fa-solid fa-angle-down cursor-pointer "
                id={node.uuid}
                data-set={node.path}
                onMouseEnter={handleScriptMouseEnter}
                onMouseLeave={handleScriptMouseLeave}
              ></i>
            ) : (
              <i
                className="fa-solid fa-angle-up cursor-pointer rotate-90"
                id={node.uuid}
                data-set={node.path}
                onMouseEnter={handleScriptMouseEnter}
                onMouseLeave={handleScriptMouseLeave}
              ></i>
            )}
          </button>
        )}

        {popUp == node.uuid && (
          <>
            <div className="bg-[#a3a2e9] opacity-[0] w-screen h-screen absolute top-0 left-0  z-10"></div>
            <div
              className="box-border bg-white  w-40  border-[1px] border-slate-300 rounded-lg shadow-lg absolute  z-40" // ref={addPopup}
              style={topState}
              ref={addPopup}
            >
              <div
                className="w-[145px] m-auto space-y-3 pt-3 pb-3"
                id={node.uuid}
                onClick={handleMore}
              >
                <p
                  className="text-lg cursor-pointer  text-textPrimary hover:bg-primary  hover:text-white hover:rounded"
                  id={node.uuid}
                >
                  <i className="fa-regular fa-file p-2" id={node.uuid}></i>New
                  page
                </p>
              </div>
              {treeNodes[0].uuid == popUp && pageCount == 1 ? (
                <></>
              ) : (
                <div
                  className="w-[145px] m-auto space-y-3 pt-1 pb-3"
                  id={node.uuid}
                  onClick={handlePageDelete}
                >
                  <p
                    className="text-lg cursor-pointer text-textPrimary hover:bg-primary hover:text-white hover:rounded"
                    id={node.uuid}
                  >
                    <i className="fa-solid fa-trash p-2" id={node.uuid}></i>
                    Delete
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {isOpen && node.ChildPages && node.ChildPages.length > 0 && (
        <ul className="ml-3 mt-1 pl-1 border-l-[1px] border-gray-400">
          {node.ChildPages.map((child, index) => (
            <li
              key={child.uuid}
              className="cursor-pointer"
              data-id={index}
              id={child.uuid}
            >
              <PageTree
                node={child}
                index={index}
                pageCount={pageCount}
                hasParent={true}
                handleScriptMouseEnter={handleScriptMouseEnter}
                handleScriptMouseLeave={handleScriptMouseLeave}
                hoverPageId={hoverPageId}
                contentPage={contentPage}
                handleMore={handleMore}
                parentOpen={parentOpen}
                role={role}
                setHoverPageId={setHoverPageId}
                popUp={popUp}
                setPopUp={setPopUp}
                handlePageDelete={handlePageDelete}
                treeNodes={treeNodes}
                inputStr={inputStr}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
