import { Routes, Route, Link } from "react-router-dom";
import { Layout, Button, Input, Menu, Dropdown } from "antd";
import styled from "@emotion/styled";
import { DownOutlined } from "@ant-design/icons";
import ToolSider from "../components/ToolSider";
import { Header } from "antd/lib/layout/layout";
import DocsInfoTemplate from "../components/DocsInfoTemplate";
import UserInfo from "../components/UserInfo";

const { Content } = Layout;
const { Search } = Input;

const Title = styled.p`
  margin-top: 10px;
  margin-left: 24px;
  font-size: 14px;
  font-family: PingFangSC-Semibold, PingFang SC;
  font-weight: 600;
  color: #666;
  line-height: 18px;
`;

const Wrapper = styled.div``;

const Home = () => {
  const createDocs = () => {
    window.location.href = `/docs/create?id=${Math.floor(Math.random() * 100)}`;
  };

  const onSearch = (value: string) => console.log(value);

  const menu = (
    <Menu>
      <Menu.Item>
        <div onClick={createDocs}>普通文档</div>
      </Menu.Item>
    </Menu>
  );
  return (
    <Layout>
      <ToolSider></ToolSider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Search onSearch={onSearch} style={{ marginRight: "400px" }}></Search>
          <Button type="primary">
            <Link to={{ pathname: "/doc/create" }}>创建文档</Link>
          </Button>
          <UserInfo />
        </Header>
        <Content
          style={{
            minHeight: 750,
          }}
        >
          <Wrapper>
            <Title>和我相关的文档</Title>
            {/* 文档列表 */}
            <DocsInfoTemplate></DocsInfoTemplate>
          </Wrapper>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
