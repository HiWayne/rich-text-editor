import styled from "@emotion/styled";
import { useState } from "react";
import { Drawer, Button } from "antd";
import useStore from "store/index";

const Avatar = styled.img`
  width: 35px;
  height: 35px;
  display: block;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  margin-left: 30px;
`;
const InfoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Info = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NickName = styled.div`
  margin-left: 10px;
`;
const UserInfo = () => {
  const [visible, setVisible] = useState(false);
  const userInfo = useStore((state) => state.userInfo);

  const showUserInfo = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  //退出系统
  const exit = () => {
    window.localStorage.setItem("refresh_token", "");
    window.localStorage.setItem("access_token", "");
    window.location.reload();
  };

  return (
    <div>
      <Avatar
        src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0518%252Fa75952c2j00qt9rfz0017c000e800e8c.jpg%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645699158&t=62b371c279d460e71bd8163767eeae9"
        onClick={showUserInfo}
      ></Avatar>
      <Drawer
        title="欢迎来到mogo文档"
        placement="right"
        onClose={onClose}
        visible={visible}
      >
        <InfoWrapper>
          <Info>
            <Avatar src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fnimg.ws.126.net%2F%3Furl%3Dhttp%253A%252F%252Fdingyue.ws.126.net%252F2021%252F0518%252Fa75952c2j00qt9rfz0017c000e800e8c.jpg%26thumbnail%3D650x2147483647%26quality%3D80%26type%3Djpg&refer=http%3A%2F%2Fnimg.ws.126.net&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645699158&t=62b371c279d460e71bd8163767eeae9"></Avatar>
            <NickName>{userInfo.name}</NickName>
          </Info>
          <Button onClick={exit} style={{ marginTop: "20px" }}>
            退出系统
          </Button>
        </InfoWrapper>
      </Drawer>
    </div>
  );
};

export default UserInfo;
