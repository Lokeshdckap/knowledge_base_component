import React from "react";
import { MergeHeader } from "../../common/commonLayouts/MergeHeader";
import { MergeView } from "../../common/commonLayouts/MergeView";

export const MergeComponents = (props) => {
  return (
    <>
      <MergeHeader
        changeEvent={props.changeEvent}
        inputValue={props.inputValue}
        setInputValue={props.setInputValue}
        renderScript={props.renderScript}
        HandleShare={props.HandleShare}
        publish={props.publish}
        role={props.role}
        getParticularScript={props.getParticularScript}
        handleMerge={props.handleMerge}

      />
      <MergeView
        treeNode={props.treeNode}
        addPage={props.addPage}
        contentPage={props.contentPage}
        pageContent={props.pageContent}
        particularTitle={props.particularTitle}
        setParticularTitle={props.setParticularTitle}
        description={props.description}
        setDescription={props.setDescription}
        handleScriptMouseEnter={props.handleScriptMouseEnter}
        handleScriptMouseLeave={props.handleScriptMouseLeave}
        hoverPageId={props.hoverPageId}
        handleMore={props.handleMore}
        handleSave={props.handleSave}
        shareState={props.shareState}
        setShareState={props.setShareState}
        onChange={props.onChange}
        editorValue={props.editorValue}
        setEditorValue={props.setEditorValue}
        editorContent={props.editorContent}
        setEditorContent={props.setEditorContent}
        parentOpen={props.parentOpen}
        teamUuid={props.teamUuid}
        setHoverPageId={props.setHoverPageId}
        popUp={props.popUp}
        setPopUp={props.setPopUp}
        handlePageDelete={props.handlePageDelete}
        isLoading={props.isLoading}
        maintainPageCount={props.maintainPageCount}
        inputStr={props.inputStr}
        setInputStr={props.setInputStr}
        showPicker={props.showPicker}
        setShowPicker={props.setShowPicker}
        setPageDeleteConfirmation={props.setPageDeleteConfirmation}
        clickPublish={props.handleSave}
        renderScript={props.renderScript}
        handleDeletePage={props.handleDeletePage}
        pageDeleteConfirmation={props.pageDeleteConfirmation}

      />
    </>
  );
};
