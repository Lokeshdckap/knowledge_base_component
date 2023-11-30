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
      <div className="mt-5 flex">
        <div className="bg-[#E4E8EC] w-[278px] h-[560px] overflow-auto">
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
          <div></div>
        </div>
        <div className={`bg-white h-[560px] ${props.widths} overflow-auto`}>
          <div>
            <input
              type="text"
              className="text-2xl ml-[80px] mt-8 focus:outline-none text-textPrimary font-bold"
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

          <div className={`pt-5 ${props.marginEditor}`}>
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
