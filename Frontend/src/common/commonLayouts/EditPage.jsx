import React, { useEffect, useRef, useState } from "react";
import { EditorComponents } from "../commonComponents/EditorComponents";
import { PageTree } from "../commonComponents/PageTree";
import { PublishPopup } from "../commonComponents/PublishPopup";
// import EditorJS from "@editorjs/editorjs";
// import Header from '@editorjs/header';
// import List from '@editorjs/list';
// import SimpleImage from '@editorjs/simple-image';
// import ImageTool from '@editorjs/image';

export default function EditPage(props) {
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
      <div className="mt-14 flex">
        <div className="bg-[#E4E8EC] w-[278px] h-[490px] overflow-auto">
          <div className="space-y-2 ml-4 mt-4">
            <div className="p-4 rounded-lg shadow">
              {treeNode.map((topLevelPage, index) => (
                <div
                  key={topLevelPage.page_id}
                  id={topLevelPage.page_id}
                  className=""
                >
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
        <div className={`bg-white h-[510px] ${props.widths} overflow-auto`}>
          <div>
            <input type="text"
              className="text-2xl ml-[80px] mt-8 focus:outline-none text-textPrimary font-bold"
              value={title}
              onChange={(e) => props.setParticularTitle(e.target.value)}
              placeholder="Page Name"
            />
          </div>
          <div>
            <input
              className="text-xl ml-[80px] mt-5 focus:outline-none text-textPrimary "
              value={props.description}
              onChange={(e) => props.setDescription(e.target.value)}
              placeholder="Page Description"
            />
          </div>
          <div className={`pt-5 ${props.marginEditor}`}>
            <EditorComponents
              handleSave={props.handleSave}
              editorState={props.setEditorContent}
              editorValue={props.editorValue}
              editorContent={props.editorContent}
              particularTitle={props.particularTitle}
            />
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
