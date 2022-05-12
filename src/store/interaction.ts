import { StateCreator } from "zustand";

export interface InteractionState {
  showMoreTools: boolean;
  setShowMoreTools: (showMoreTools: boolean) => void;
}

const createInteractionState: StateCreator<InteractionState> = (set, get) => ({
  showMoreTools: false,
  setShowMoreTools: (showMoreTools: boolean) => {
    set({ showMoreTools });
  },
});

export default createInteractionState;
