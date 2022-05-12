import create from "zustand";
import {} from "zustand/middleware/combine";
import createEditorState, { EditorState } from "./editor";
import createInteractionState, { InteractionState } from "./interaction";

type Store = EditorState & InteractionState;

const useStore = create<Store>()((...args) => ({
  ...createEditorState(...args),
  ...createInteractionState(...args),
}));

export default useStore;
