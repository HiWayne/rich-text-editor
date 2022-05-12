import { convertFromRaw, EditorState as EditorStateInDraft } from "draft-js";
import { StateCreator } from "zustand";
import PrismDecorator from "draft-js-prism";
import Prism from "prismjs";
import "assets/css/prism-okaidia.css";

export interface EditorState {
  editorState: EditorStateInDraft;
  setEditorState: (newEditorState: EditorStateInDraft) => void;
}

const decorator = new PrismDecorator({
  // Provide your own instance of PrismJS
  prism: Prism,
  defaultSyntax: "javascript",
});

const contentState = convertFromRaw({
  entityMap: {},
  blocks: [
    {
      type: "header-three",
      text: "Hi there 👋",
    },
    {
      type: "unstyled",
      text: "Here are some ideas to get you started:",
    },
    {
      type: "unordered-list-item",
      text: "🔭 I’m currently working on ...",
    },
    {
      type: "unordered-list-item",
      text: "🌱 I’m currently learning ...",
    },
    {
      type: "unordered-list-item",
      text: "👯 I’m looking to collaborate on ...",
    },
    {
      type: "unordered-list-item",
      text: "🤔 I’m looking for help with ...",
    },
    {
      type: "unordered-list-item",
      text: "💬 Ask me about ...",
    },
    {
      type: "unordered-list-item",
      text: "📫 How to reach me: ...",
    },
    {
      type: "unordered-list-item",
      text: "😄 Pronouns: ...",
    },
    {
      type: "unordered-list-item",
      text: "⚡ Fun fact: ...",
    },
    {
      type: "unstyled",
      text: "You can type some JavaScript below:",
    },
    {
      type: "code-block",
      text: 'const message = "This is awesome!";',
    },
  ],
});

const createEditorState: StateCreator<EditorState> = (set, get) => ({
  editorState: EditorStateInDraft.createWithContent(contentState, decorator),
  setEditorState: (newEditorState: EditorStateInDraft) =>
    set({
      editorState: newEditorState,
    }),
});

export default createEditorState;
