import React, { useEffect, useRef, useState } from "react";
import { EditorComponents } from "../commonComponents/EditorComponents";
import { PageTree } from "../commonComponents/PageTree";
import { PublishPopup } from "../commonComponents/PublishPopup";
import { useMyContext } from "../../context/AppContext";

export default function EditPage(props) {
  const { renderScript } = props;
  const [newPagePopup, setNewPagePopup] = useState(false);
  const [OverPage, setOverPage] = useState(null);
  const treeNode = props.treeNode;
  const { screenHeight, setScreenHeight } = useMyContext();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    props.setParticularTitle(props.particularTitle);
    props.setDescription(props.description);

    const updateScreenHeight = () => {
      setScreenHeight(window.innerHeight);
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateScreenHeight);

    return () => {
      window.removeEventListener("resize", updateScreenHeight);
    };
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
    <div className="bg-[#F4F7FC]" style={{ height: "calc(100% - 64px)" }}>
      <div className="flex">
        <div
          className=" w-[278px] phone:w-[150px] overflow-auto border-r-[1px]"
          style={{
            height: `calc(${screenHeight}px - 64px)`,
          }}
        >          
          <div className="space-y-2 ml-4 phone:ml-px mt-4">
            <div className="p-4  phone:p-2 rounded-lg shadow">
              {treeNode.map((topLevelPage, index) => (
                <div key={topLevelPage.uuid} id={topLevelPage.uuid}>
                  <PageTree
                    node={topLevelPage}
                    index={index}
                    pageCount={props.maintainPageCount}
                    hasParent={false}
                    contentPage={props.contentPage}
                    handleScriptMouseLeave={props.handleScriptMouseLeave}
                    handleScriptMouseEnter={props.handleScriptMouseEnter}
                    hoverPageId={props.hoverPageId}
                    handleMore={props.handleMore}
                    parentOpen={props.parentOpen}
                    setHoverPageId={props.setHoverPageId}
                    popUp={props.popUp}
                    setPopUp={props.setPopUp}
                    handlePageDelete={props.handlePageDelete}
                    treeNodes={treeNode}
                  />
                </div>
              ))}
            </div>
          </div>
          <hr
            className={`h-px w-[100%] bg-[#D5D7DA] border-0 m-auto dark:bg-gray-900 mt-4`}
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
        <div
          className={`bg-[#fbfbfc] px-[30px]  overflow-auto`}
          style={{
            width:
              screenWidth > "425" ? "calc(100% - 278px)" : "calc(100% - 150px)",
            maxHeight: `calc(${screenHeight}px - 64px)`,
          }}
        >
          <div>
            <input
              type="text"
              className="text-3xl phone:text-[18px] phone:w-[190px] mt-8 focus:outline-none text-textPrimary font-bold"
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
              className="text-xl phone:text-[16px] phone:w-[170px] mt-3 focus:outline-none text-textPrimary "
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
                contentPage={props.contentPage}
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
