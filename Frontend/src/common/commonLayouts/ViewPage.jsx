import React, { useEffect, useRef, useState } from "react";
import { PageTree } from "../commonComponents/PageTree";
import { ViewEditorComponents } from "../commonComponents/ViewEditorComponents";
import { useMyContext } from "../../context/AppContext";

export const ViewPage = (props) => {
  const { renderScript } = props;
  const {
    screenHeight, setScreenHeight
  } = useMyContext();
  const [newPagePopup, setNewPagePopup] = useState(false);
  const [OverPage, setOverPage] = useState(null);
  const treeNode = props.treeNode;

  useEffect(() => {
    props.setParticularTitle(props.particularTitle);
    props.setDescription(props.description);
    const updateScreenHeight = () => {
      setScreenHeight(window.innerHeight);
    };

    // Attach the event listener for window resize
    window.addEventListener('resize', updateScreenHeight);
    return () => {
      window.removeEventListener("resize", updateScreenHeight);
    };
  }, [props.particularTitle, props.description, props.editorContent]);

  const title = props.particularTitle;

  return (
    <div className="bg-[#F4F7FC]" style={{ height: "calc(100% - 64px)" }}>
      <div className="flex">
        <div className=" w-[278px]  overflow-auto border-r-[1px]"
          style={{
            height: `calc(${screenHeight}px - 64px)`,
          }}
        >
          <div className="space-y-2 ml-4 mt-4">
            <div className="p-4 rounded-lg shadow">
              {treeNode.map((topLevelPage, index) => (
                <div key={topLevelPage.uuid} id={topLevelPage.uuid}>
                  <PageTree
                    node={topLevelPage}
                    index={index}
                    hasSibling={index < treeNode.length - 1}
                    hasParent={false}
                    contentPage={props.contentPage}
                    handleScriptMouseLeave={props.handleScriptMouseLeave}
                    handleScriptMouseEnter={props.handleScriptMouseEnter}
                    handleMore={props.handleMore}
                    parentOpen={props.parentOpen}
                  />
                </div>
              ))}
            </div>
          </div>
          <hr
            className={`h-px w-[250px] bg-[#D5D7DA] border-0 m-auto dark:bg-gray-900 mt-4`}
          />
        </div>
        <div className={`bg-[#fbfbfc] px-[30px]  overflow-auto`} 
             style={{
              width: "calc(100% - 278px)",
              maxHeight: `calc(${screenHeight}px - 64px)`,
            }}
        >
          <div>
            <input
              type="text"
              className="text-2xl  mt-8 focus:outline-none text-textPrimary font-bold"
              value={title}
              placeholder="Page Name"
              readOnly={true}
            />
          </div>
          <div>
            <input
              className="text-2xl  mt-5 focus:outline-none text-textPrimary "
              value={props.description}
              placeholder="Page Description"
              readOnly={true}
            />
          </div>

          <div className={`pt-3 `}>
            {renderScript && (
              <ViewEditorComponents
                handleSave={props.handleSave}
                editorContent={props.editorContent}
                setEditorContent={props.setEditorContent}
                editorValue={props.editorValue}
                setEditorValue={props.setEditorValue}
                particularTitle={props.particularTitle}
                publish={props.publish}
                renderScript={renderScript}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
