import styled from "@emotion/styled";
import { Table, Space, Button, Modal } from "antd";
import { deleteDoc, getDocList } from "api/doc";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { DocInfo } from "store/doc";
import useStore from "store/index";

const { Column } = Table;

const Wrapper = styled.div`
  padding: 0 24px;
`;

const DocsInfoTemplate = () => {
  const [data, setData] = useState<DocInfo[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const userInfo = useStore((state) => state.userInfo);

  const deleteDocIdRef = useRef<number>(null as any);

  const showModal = (docId: number) => {
    deleteDocIdRef.current = docId;
    setModalVisible(true);
  };

  const hiddenModal = () => {
    setModalVisible(false);
  };

  const handleDeleteDoc = () => {
    // 删除文档
    deleteDoc({ docId: deleteDocIdRef.current }).then((result: boolean) => {
      if (result) {
        hiddenModal()
        if (userInfo.id) {
          getDocList({ userId: userInfo.id }).then((list: DocInfo[]) => {
            setData(list);
          });
        }
      }
    });
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const viewDoc = (doc: DocInfo) => {
    window.open(`/doc/create?id=${doc.id}`);
  };

  useEffect(() => {
    if (userInfo.id) {
      getDocList({ userId: userInfo.id }).then((list: DocInfo[]) => {
        setData(list);
      });
    }
  }, [userInfo]);

  return (
    <Wrapper>
      <Table dataSource={data}>
        <Column title="文档名称" dataIndex="name" key="id" />
        <Column title="原作者" dataIndex="creator_name" key="id" />
        <Column
          title="最近更新时间"
          dataIndex="update_time"
          key="update_time"
        />
        <Column title="创建时间" dataIndex="create_time" key="id" />
        <Column
          key="id"
          title="操作"
          render={(text, record: DocInfo) => (
            <Space>
              <Button type="primary" onClick={(text) => viewDoc(record)}>
                查看
              </Button>
              <Button
                type="primary"
                danger
                onClick={() => showModal(record.id)}
              >
                删除
              </Button>
            </Space>
          )}
        />
      </Table>
      <Modal
        title="提示"
        visible={modalVisible}
        onOk={handleDeleteDoc}
        onCancel={handleCancel}
        cancelText="取消"
        okText="确认"
      >
        <div>确认删除该文档吗</div>
      </Modal>
    </Wrapper>
  );
};

export default DocsInfoTemplate;
