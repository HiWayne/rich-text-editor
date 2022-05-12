import { useEffect, useState, ChangeEventHandler } from "react";
import styled from "@emotion/styled";
import axios from "axios";
import qs from "qs";
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

const Login = () => {
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
  let params = {
    username,
    password,
  };
  const handleLogin = () => {
    setIsLogin(true);
    axios
      .post("http://localhost:8080/users/login", qs.stringify(params))
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          // setIsLogin(true)
          window.location.href = "/index";
        } else {
          //提示注册失败原因
        }
      });
  };
  const handleRegister = () => {
    let params = {
      username,
      password,
    };
    setIsLogin(false);
    // post 请求时 如果Content-Type的值不是浏览器所能识别的三种之外的 将会被认为是跨域
    // 所以 当用post请求 并且参数类型是json时 就需要使用qs将其字符化 来解决跨域
    axios
      .post("http://localhost:8080/users/register", qs.stringify(params))
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setIsLogin(true);
        } else {
          //提示注册失败原因
        }
      });
  };
  const toBeLogin = () => {
    setIsLogin(!isLogin);
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
          <span style={{ color: "red", cursor: "pointer" }} onClick={toBeLogin}>
            点击注册
          </span>
        </div>
      ) : (
        <div style={{ marginTop: "20px" }}>
          已有账号？
          <span style={{ color: "red", cursor: "pointer" }} onClick={toBeLogin}>
            点击登录
          </span>
        </div>
      )}
    </Wrapper>
  );
};

export default Login;
