import React, { useEffect, useRef, useState } from "react";
import { EditorComponents } from "../commonComponents/EditorComponents";
import { PageTree } from "../commonComponents/PageTree";
import { PublishPopup } from "../commonComponents/PublishPopup";
import { ViewEditorComponents } from "../commonComponents/ViewEditorComponents";

export const ViewPage = (props) => {
  const { renderScript } = props;

  const [newPagePopup, setNewPagePopup] = useState(false);
  const [OverPage, setOverPage] = useState(null);
  const treeNode = props.treeNode;
  useEffect(() => {
    props.setParticularTitle(props.particularTitle);
    props.setDescription(props.description);
  }, [props.particularTitle, props.description, props.editorContent]);

  const title = props.particularTitle;
  const handleMouseEnter = (e) => {
    let targetId = e.target.id;
    setOverPage(targetId);
  };

  const handleMouseLeave = () => {
    setOverPage(null);
  };

  const handlePopupPage = () => {
    setNewPagePopup((prevState) => !prevState);
  };

  return (
    <div>
      <div className="flex">
        <div className="bg-[#fbfbfc] w-[278px] h-[524px] overflow-auto border-r-[1px]">
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
        <div className={`bg-[#ffff] max-h-[520px]  overflow-auto`} 
        style={{width: "calc(100% - 278px)"}}
        >
          <div>
            <input
              type="text"
              className="text-xl ml-[80px] mt-5 focus:outline-none text-textPrimary font-bold"
              value={title}
              placeholder="Page Name"
              readOnly={true}
            />
          </div>
          <div>
            <input
              className="text-xl ml-[80px] mt-5 focus:outline-none text-textPrimary "
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
