import { useLinkClickHandler } from "react-router-dom";
import {
  useEffect,
  useState,
  ChangeEventHandler,
  ReactEventHandler,
  MouseEventHandler,
  FC,
} from "react";
import styled from "@emotion/styled";
import axios from "axios";
import qs from "qs";
import { userLogin, userRegister } from "api/user";
import useStore from "store/index";
// import { RegisterUser } from '../../api/login'

const Wrapper = styled.div`
  width: 100%;
  height: 822px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
`;

const FormWrapper = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ToolBar = styled.div`
  margin-top: 20px;
  width: 500px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Forget = styled.div`
  color: #0375ff;
  cursor: pointer;
`;

const Checkout = styled.input``;

const InfoInput = styled.input`
  width: 500px;
  height: 40px;
  // border: none;
  &:not(:first-of-type) {
    margin-top: 20px;
  }
`;

const Button = styled.button`
  width: 500px;
  height: 40px;
  border: none;
  margin-top: 20px;
  color: white;
  cursor: pointer;
`;

const Login: FC<{
  setPermission: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setPermission }) => {
  const setUserInfo = useStore((state) => state.setUserInfo);
  const navigateToHome = useLinkClickHandler("/");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  //获取到 用户输入的 用户名
  const getInputValue: ChangeEventHandler<HTMLInputElement> = (e) => {
    setUsername(e.target.value);
  };
  //获取到 用户输入的 密码
  const getInputPasswordValue: ChangeEventHandler<HTMLInputElement> = (e) => {
    setPassword(e.target.value);
  };

  const changeToLogin = () => {
    setIsLogin(true);
  };

  const params = {
    name: username,
    password,
  };
  const handleLogin: MouseEventHandler<any> = async (e) => {
    const data = await userLogin(params);
    if (data) {
      setPermission(true);
      setUserInfo(data.user);
      navigateToHome(e);
    }
  };
  const handleRegister: MouseEventHandler<any> = async (e) => {
    const user = await userRegister(params);
    if (user) {
      changeToLogin();
    }
  };
  const toggleSelection = () => {
    setIsLogin((isLogin) => !isLogin);
  };
  useEffect(() => {});
  return (
    <Wrapper>
      <FormWrapper>
        <InfoInput placeholder="Username" onChange={getInputValue}></InfoInput>
        <InfoInput
          placeholder="Password"
          type="password"
          onChange={getInputPasswordValue}
        ></InfoInput>
      </FormWrapper>
      {isLogin ? (
        <ToolBar>
          <div>
            <Checkout type="checkbox" /> Remember me
          </div>
          <Forget>Forget password</Forget>
        </ToolBar>
      ) : null}

      <Button
        style={{ background: "#0375ff" }}
        onClick={isLogin ? handleLogin : handleRegister}
      >
        {isLogin ? "登录" : "注册"}
      </Button>
      {/* 登录 注册显示不同信息 */}
      {isLogin ? (
        <div style={{ marginTop: "20px" }}>
          没有账号？
          <span
            style={{ color: "red", cursor: "pointer" }}
            onClick={toggleSelection}
          >
            点击注册
          </span>
        </div>
      ) : (
        <div style={{ marginTop: "20px" }}>
          已有账号？
          <span
            style={{ color: "red", cursor: "pointer" }}
            onClick={toggleSelection}
          >
            点击登录
          </span>
        </div>
      )}
    </Wrapper>
  );
};

export default Login;
