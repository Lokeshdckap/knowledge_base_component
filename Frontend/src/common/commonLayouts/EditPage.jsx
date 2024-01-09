import React, { useEffect, useRef, useState } from "react";
import { EditorComponents } from "../commonComponents/EditorComponents";
import { PageTree } from "../commonComponents/PageTree";
import { PublishPopup } from "../commonComponents/PublishPopup";
import { useMyContext } from "../../context/AppContext";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { Button, Flex } from 'antd';
import Picker from "emoji-picker-react";

export default function EditPage(props) {
  const { renderScript } = props;
  const [newPagePopup, setNewPagePopup] = useState(false);
  const [OverPage, setOverPage] = useState(null);
  const items = [
    {
      label: "Save & Publish",
      key: "1",
      onClick: props.handleSaveAndPublish,
    },
  ];
  const [loadings, setLoadings] = useState([]);
  const treeNode = props.treeNode;
  const {
    screenHeight,
    setScreenHeight,
    hasChanges,
    setHasChanges,
    handleLinkClick,
  } = useMyContext();
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

  const onEmojiClick = (event, emojiObject) => {
    props.setInputStr(event.imageUrl);

    props.setShowPicker(false);
  };

  const title = props.particularTitle;

  return (
    <div className="bg-[#F4F7FC]" style={{ height: "calc(100% - 66px)" }}>
      <div className="flex">
        <div
          className=" w-[278px] phone:w-[150px] overflow-auto border-r-[1px]"
          style={{
            height: `calc(${screenHeight}px - 66px)`,
          }}
        >
          <div className="space-y-2 ml-4 phone:ml-px mt-3">
            <div onClick={props.addPage} className="flex justify-end pr-5">
              <button
                type="button"
                className="text-primary text-[14px] hover:text-white border border-primary hover:bg-primary font-medium rounded-[8px]  px-3 py-1.5 text-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
              >
                <i className="fa-solid fa-plus pr-1"></i>
                Add Page
              </button>
            </div>
            <div className="p-4 phone:p-2 rounded-lg shadow">
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
                    inputStr={props.inputStr}
                    setPageDeleteConfirmation={props.setPageDeleteConfirmation}
                  />
                </div>
              ))}
            </div>
          </div>
          <hr
            className={`h-px w-[100%] bg-[#D5D7DA] border-0 m-auto dark:bg-gray-900 mt-4`}
          />
        </div>
        <div
          className={`bg-[#fbfbfc] px-[30px]  overflow-auto`}
          style={{
            width:
              screenWidth > "425" ? "calc(100% - 278px)" : "calc(100% - 150px)",
            maxHeight: `calc(${screenHeight}px - 66px)`,
          }}
        >
          <div className="flex  items-center relative space-x-2 mt-8">
            <div className="">
              <img
                className="cursor-pointer w-[25px]"
                src={
                  props.inputStr
                    ? props.inputStr
                    : `https://icons.getbootstrap.com/assets/icons/emoji-smile.svg`
                }
                onClick={() => {
                  props.setShowPicker((val) => !val);
                  setHasChanges(true);
                }}
              />
              {props.showPicker && (
                <>
                  <Picker
                    style={{
                      width: "50%",
                      position: "absolute",
                      zIndex: 10,
                      left: "0px",
                    }}
                    onEmojiClick={onEmojiClick} // Ensure this is correctly spelled and defined
                  />
                </>
              )}
            </div>
            <div className="flex justify-between items-center">
              <input
                type="text"
                className="text-3xl phone:text-[18px] phone:w-[190px] py-1 pl-1 rounded-sm bg-[#fbfbfc] font-inter focus:bg-[#e6ebf8] hover:bg-[#e6ebf8] focus:outline-none text-textPrimary font-bold"
                value={title}
                onChange={(e) => {
                  props.setParticularTitle(e.target.value);
                  setHasChanges(true);
                }}
                placeholder="Page Name"
                readOnly={
                  props.publish && props.publish.is_published ? true : false
                }
              />
              <div>
              <Button className="ml-20" onClick={props.clickPublish}>Save this Page</Button>
       
              </div>
            </div>
          </div>
          <div>
            <input
              className="text-xl phone:text-[16px] font-inter phone:w-[170px] bg-[#fbfbfc] focus:bg-[#e6ebf8] hover:bg-[#e6ebf8] rounded-sm py-1 pl-2 mt-3 ml-[28px] focus:outline-none text-textPrimary "
              value={props.description}
              onChange={(e) => {
                props.setDescription(e.target.value);
                setHasChanges(true);
              }}
              placeholder="Page Description"
              readOnly={
                props.publish && props.publish.is_published ? true : false
              }
            />
          </div>
          <div className={`pt-3`}>
            {props.setIsLoading ? (
              <div role="status" className="py-[50px]">
                <div role="status" className="py-[50px]">
                  <svg
                    aria-hidden="true"
                    className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : (
              renderScript && (
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
              )
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
