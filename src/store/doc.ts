import { StateCreator } from "zustand";

export interface DocInfo {
  id: number;
  name: string;
  cover: string;
  desc: string;
  creator: number;
  creator_name: string;
  create_time: string;
  update_time: string;
}

export interface DocState {
  docInfo: DocInfo;
  setDocInfo: (newDocInfo: Partial<DocInfo>) => void;
}

const createDocState: StateCreator<DocState> = (set, get) => ({
  docInfo: {} as any,
  setDocInfo: (newDocInfo) => {
    set((state) => ({ docInfo: { ...state.docInfo, ...newDocInfo } }));
  },
});

export default createDocState;
