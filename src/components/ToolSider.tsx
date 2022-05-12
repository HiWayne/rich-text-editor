import { Layout, Menu } from 'antd'
import { Link } from 'react-router-dom'
import {
  VideoCameraOutlined,
  UploadOutlined,
  DeleteOutlined
} from '@ant-design/icons'

const { Sider } = Layout

const ToolSider = () => {
  return (
    <Sider trigger={null}>
      <Menu theme='dark' mode='inline' defaultSelectedKeys={['1']}>
        <Menu.Item key='1' icon={<UploadOutlined />}>
          <Link to='/index'>首页</Link>
        </Menu.Item>
        <Menu.Item key='2' icon={<VideoCameraOutlined />}>
          <Link to='/favorite'>我的收藏</Link>
        </Menu.Item>
        <Menu.Item key='3' icon={<DeleteOutlined />}>
          <Link to='/rubbish'>回收站</Link>
        </Menu.Item>
        <Menu.Item key='4' icon={<UploadOutlined />}>
          <Link to='/help'>帮助</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  )
}

export default ToolSider
