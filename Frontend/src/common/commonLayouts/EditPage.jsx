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
    <div className="bg-[#F4F7FC]" style={{ height: "calc(100% - 70px)" }}>
      <div className="flex">
        <div className=" w-[278px] xl:max-h-[510px] lg:max-h-[570px] md:max-h-[1000px] overflow-auto border-r-[1px]">
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
          </div>
        </div>
        <div className={`bg-[#fbfbfc] xl:max-h-[510px] px-[30px] lg:max-h-[580px] md:max-h-[1000px] overflow-auto`} 
            style={{width: "calc(100% - 278px)"}}
        >
    
          <div>
            <input
              type="text"
              className="text-2xl mt-8 focus:outline-none text-textPrimary font-bold"
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
              className="text-xl  mt-5 focus:outline-none text-textPrimary "
              value={props.description}
              onChange={(e) => props.setDescription(e.target.value)}
              placeholder="Page Description"
              readOnly={
                props.publish && props.publish.is_published ? true : false
              }
            />
          </div>

          <div className={`pt-3`}>
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
