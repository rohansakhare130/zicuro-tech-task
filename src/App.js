import "./App.css";
import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  convertToRaw,
  convertFromRaw,
  ContentState,
} from "draft-js";
import "draft-js/dist/Draft.css";

function App() {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  const saveContent = () => {
    const contentState = editorState.getCurrentContent();
    localStorage.setItem(
      "editorContent",
      JSON.stringify(convertToRaw(contentState))
    );
    alert("Content saved!");

    // Reset editor to normal empty content (without previous formatting)
    const emptyContentState = ContentState.createFromText(""); // Creates a fresh, empty content state
    setEditorState(EditorState.createWithContent(emptyContentState)); // Set empty content
  };

  const styleMap = {
    RED: {
      color: "red",
      fontSize: "14px",
    },
    HEADING: {
      fontSize: "24px",
      fontWeight: "bold",
    },
    UNDERLINE: {
      textDecoration: "underline",
      color: "black",
      fontSize: "14px",
    },
  };

  const handleBeforeInput = (input) => {
    const contentState = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const blockKey = selection.getStartKey();
    const blockText = contentState.getBlockForKey(blockKey).getText();

    // Check the first part of the line and apply the corresponding style
    if (input === " ") {
      if (blockText === "#") {
        const updatedContent = Modifier.replaceText(
          contentState,
          selection.merge({
            anchorOffset: 0,
            focusOffset: blockText.length,
          }),
          ""
        );
        const newState = EditorState.push(
          editorState,
          updatedContent,
          "remove-range"
        );
        setEditorState(RichUtils.toggleInlineStyle(newState, "HEADING"));
        return "handled";
      }

      if (blockText === "*") {
        const updatedContent = Modifier.replaceText(
          contentState,
          selection.merge({
            anchorOffset: 0,
            focusOffset: blockText.length,
          }),
          ""
        );
        const newState = EditorState.push(
          editorState,
          updatedContent,
          "remove-range"
        );
        setEditorState(RichUtils.toggleInlineStyle(newState, "BOLD"));
        return "handled";
      }

      if (blockText === "**") {
        const updatedContent = Modifier.replaceText(
          contentState,
          selection.merge({
            anchorOffset: 0,
            focusOffset: blockText.length,
          }),
          ""
        );
        const newState = EditorState.push(
          editorState,
          updatedContent,
          "remove-range"
        );
        setEditorState(RichUtils.toggleInlineStyle(newState, "RED"));
        return "handled";
      }

      if (blockText === "***") {
        const updatedContent = Modifier.replaceText(
          contentState,
          selection.merge({
            anchorOffset: 0,
            focusOffset: blockText.length,
          }),
          ""
        );
        const newState = EditorState.push(
          editorState,
          updatedContent,
          "remove-range"
        );
        setEditorState(RichUtils.toggleInlineStyle(newState, "UNDERLINE"));
        return "handled";
      }
    }

    return "not-handled";
  };

  return (
    <div className="flex flex-col gap-5 w-screen h-screen bg-gray-100 p-12">
      <div className="flex w-full items-center justify-between">
        <div className="w-full text-center">
          <p className="text-xl font-medium">Demo Editor by Zicuritech</p>
        </div>

        <button
          className="mt-4 p-2 bg-gray-400 text-white font-bold rounded w-32 hover:bg-white hover:text-black hover:border hover:border-slate-400"
          onClick={saveContent}
        >
          Save
        </button>
      </div>
      <div className="w-full h-full border border-red-600 p-5">
        <Editor
          editorState={editorState}
          onChange={(newState) => setEditorState(newState)}
          customStyleMap={styleMap}
          handleBeforeInput={handleBeforeInput}
          placeholder="Type here..."
        />
      </div>
    </div>
  );
}

export default App;
