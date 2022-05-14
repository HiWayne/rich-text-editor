import create from "zustand";
import {} from "zustand/middleware/combine";
import createEditorState, { EditorState } from "./editor";
import createInteractionState, { InteractionState } from "./interaction";
import createUserState, { UserState } from "./user";
import createDocState, { DocState } from "./doc";

type Store = EditorState & InteractionState & UserState & DocState;

const useStore = create<Store>()((...args) => ({
  ...createEditorState(...args),
  ...createInteractionState(...args),
  ...createUserState(...args),
  ...createDocState(...args),
}));

export default useStore;
