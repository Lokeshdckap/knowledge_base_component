import React, { useEffect, useRef, useState } from "react";
import { EditorComponents } from "../commonComponents/EditorComponents";
import { PageTree } from "../commonComponents/PageTree";
import { PublishPopup } from "../commonComponents/PublishPopup";

export default function EditPage(props) {
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
                    hoverPageId={props.hoverPageId}
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
          <div>
            <div>
              <p
                className="text-xl cursor-pointer text-[#90979D] pl-5 pt-3"
                onClick={props.addPage}
              >
                <i className="fa-regular fa-file" onClick={props.addPage}></i>{" "}
                New Page
              </p>
            </div>
            {/* <div>
              {newPagePopup && (
                <div className="box-border bg-white h-28 w-56 p-4 mt-1 border-[1px] m-auto rounded shadow-lg ">
                  <p
                    className="text-lg mb-2 pl-2 cursor-pointer"
                    onClick={props.addPage}
                  >
                    <i
                      className="fa-regular fa-file pr-2 ml-6"
                      onClick={props.addPage}
                    ></i>
                    New Page
                  </p>
                  <hr
                    className={`h-px  bg-[#D5D7DA] border-0 dark:bg-gray-900 `}
                  />
                  <p className="text-lg mt-2 pl-2 cursor-pointer">
                    <i className="fa-regular fa-file pr-2 ml-6"></i>New Group
                  </p>
                </div>
              )}
            </div> */}
          </div>
        </div>
        <div className={`bg-[#ffff] max-h-[520px]  overflow-auto`} 
        style={{width: "calc(100% - 278px)"}}
        >
          <div>
            <input
              type="text"
              className="text-2xl ml-[80px] mt-8 focus:outline-none text-textPrimary font-bold"
              value={title}
              onChange={(e) => props.setParticularTitle(e.target.value)}
              placeholder="Page Name"
              readOnly={
                props.publish && props.publish.is_published ? true : false
              }
            />
          </div>
          <div>
            <input
              className="text-xl ml-[80px] mt-5 focus:outline-none text-textPrimary "
              value={props.description}
              onChange={(e) => props.setDescription(e.target.value)}
              placeholder="Page Description"
              readOnly={
                props.publish && props.publish.is_published ? true : false
              }
            />
          </div>

          <div className={`pt-5`}>
            {renderScript && (
              <EditorComponents
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
      {props.shareState && (
        <PublishPopup
          setShareState={props.setShareState}
          onChange={props.onChange}
          publish={props.publish}
          renderScript={props.renderScript}
          teamUuid={props.teamUuid}
        />
      )}
    </div>
  );
}
