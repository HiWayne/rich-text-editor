import styled from '@emotion/styled'
import { Table } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'

const { Column } = Table

const Wrapper = styled.div`
  padding: 0 24px;
`

const data = [
  {
    type: '普通文档',
    name: '你不努力谁替你努力',
    owner: '李易峰',
    recentTime: '2022-2-13'
  },
  {
    type: '普通文档',
    name: '欲戴皇冠，必承其重',
    owner: '鹿晗',
    recentTime: '2022-2-13'
  },
  {
    type: '普通文档',
    name: '努力不一定成功，但不努力一定不成功',
    owner: '张杰',
    recentTime: '2022-2-13'
  }
]

const DocsInfoTemplate = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    axios.post('http://localhost:8080/docs/see').then(res => {
      if (res.status === 200) {
        setData(res.data.data.results)
        // setIsLogin(true)
        // window.location.href = '/index'
      } else {
        //提示注册失败原因
      }
    })
  }, [])

  return (
    <Wrapper>
      <Table
        dataSource={data}
        onRow={record => {
          return {
            onClick: event => {
              window.open(`/docs/create?id=${record.id}`)
            } // 点击行
          }
        }}
      >
        <Column title='文档类型' dataIndex='type' key='type' />
        <Column title='文档名称' dataIndex='title' key='title' />
        <Column title='所属人' dataIndex='author' key='author' />
        <Column title='最近打开时间' dataIndex='latestAt' key='latestAt' />
      </Table>
    </Wrapper>
  )
}

export default DocsInfoTemplate
