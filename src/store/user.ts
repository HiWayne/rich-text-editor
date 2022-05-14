import { StateCreator } from "zustand";

export interface UserInfo {
  id: number;
  name: string;
  avatar: string;
  desc: string;
  create_time: number;
}

export interface UserState {
  userInfo: UserInfo;
  setUserInfo: (newUserInfo: Partial<UserInfo>) => void;
}

const createUserState: StateCreator<UserState> = (set, get) => ({
  userInfo: null as any,
  setUserInfo: (newUserInfo) => {
    set((state) => ({ userInfo: { ...state.userInfo, ...newUserInfo } }));
  },
});

export default createUserState;
