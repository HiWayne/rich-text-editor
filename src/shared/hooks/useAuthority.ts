import { getProfile } from "api/user";
import { createBrowserHistory } from "history";
import { useEffect, useState } from "react";
import useStore from "store/index";
import { UserInfo } from "store/user";
import shallow from "zustand/shallow";

const history = createBrowserHistory();

const useAuthority = () => {
  const [userInfo, setUserInfo] = useStore(
    (state) => [state.userInfo, state.setUserInfo],
    shallow
  );
  const [hasPermission, setPermission] = useState(!!userInfo);

  useEffect(() => {
    if (!hasPermission) {
      getProfile()
        .then((data: UserInfo) => {
          if (data) {
            setUserInfo(data);
            setPermission(true);
          } else {
            history.push("/login");
          }
        })
        .catch(() => {
          history.push("/login");
        });
    }
  }, []);

  return [hasPermission, setPermission];
};

export default useAuthority;
