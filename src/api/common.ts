import { createBrowserHistory } from "history";
import { post } from "./request";

// 刷新access_token
// { token: string }
export const refreshToken = (params: { token: string }) =>
  post("http://localhost:3001/api/user/refresh/token")(params).then(
    (data: { access_token: string }) => {
      if (!data) {
        const history = createBrowserHistory();
        history.push("/login");
      } else {
        return data;
      }
    }
  );
