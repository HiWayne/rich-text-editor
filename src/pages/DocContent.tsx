import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "@emotion/styled";
import debounce from "debounce";
import { Delta, patch } from "jsondiffpatch";
import {
  ContentBlock,
  convertFromRaw,
  convertToRaw,
  DraftEditorCommand,
  Editor,
  EditorState,
  RichUtils,
} from "draft-js";
import { Button, Divider, Input, Popover, Tooltip, Select } from "antd";
import {
  LeftOutlined,
  StarOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { throttling, getParams } from "@duitang/dt-base";
import CopyToClipboard from "react-copy-to-clipboard";
import useStore from "store/index";
import shallow from "zustand/shallow";
import UserInfo from "../components/UserInfo";
import ToolBar from "components/ToolBar";
import { TOOL_ITEM_NAMES } from "components/ToolBar/ToolItems";
import { createDoc, getDocDetail, updateDoc } from "api/doc";

const { Option } = Select;

const ICON_STYLE = {
  fontSize: "20px",
  margin: "0 20px",
};

const TopTool = styled.div`
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
  padding: 0 20px;
  border-bottom: 0.5px solid #444444;
`;

const InnerLeft = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const DocsName = styled.input`
  outline: none;
  border: 1px solid rgba(0, 0, 0, 0);
  overflow: hidden;
  white-space: nowrap;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  color: var(--text-title);
  font-size: 14px;
  line-height: 20px;
  padding: 0 5px;
`;

const LatestTime = styled.span`
  color: #777;
  font-size: 10px;
`;

const HoverIcon = styled.div`
  &:hover {
    background: #444444;
    opacity: 0.5;
    // height: auto;
    // width: auto;
    border-radius: 5px;
  }
`;
const Main = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-top: 5px;
  width: 100%;
  height: auto;
`;

const NavBar = styled.div`
  max-width: 120px;
  height: auto;
`;

const Content = styled.div`
  width: 70%;
`;

const id = getParams(window.location.search);

const editorStyleMap = {
  CODE: {
    marginLeft: "2px",
    marginRight: "2px",
    paddingLeft: "2px",
    paddingRight: "2px",
    borderRadius: "3px",
    border: "1px solid var(--line-border-card)",
    backgroundColor: "var(--bg-body-overlay)",
  },
};

const myBlockStyleFn = (contentBlock: ContentBlock) => {
  const type = contentBlock.getType();
  switch (type) {
    case TOOL_ITEM_NAMES.BLOCK_QUOTE:
      return "customBlockquote";
    case TOOL_ITEM_NAMES.CODE_BLOCK:
      return "language-prism";
    default:
      return null as any;
  }
};

// const myBlockRenderer = (contentBlock: ContentBlock) => {
//   switch (contentBlock.getType()) {
//     case TOOL_ITEM_NAMES.BLOCK_QUOTE:
//       return {
//         component: BlockQuote,
//         editable: true,
//         props: {},
//       };
//     default:
//       return;
//   }
// };

/**
 *
 * @description 文档需要有哪些操作
 * inline: 加粗 bold、斜体 i、字体颜色、字体背景、删除线、超链接、下划线、代码
 * block: 标题 H1-H9、有序列表、无序列表、任务列表、引用、高亮、代码块、左对齐、居中、右对齐
 *
 */

const DocContent = () => {
  console.log(1);

  const { id } = getParams("");
  const [editorState, setEditorState, initEditorState] = useStore(
    (state) => [state.editorState, state.setEditorState, state.initEditorState],
    shallow
  );

  const userInfo = useStore((state) => state.userInfo);
  const [docInfo, setDocInfo] = useStore(
    (state) => [state.docInfo, state.setDocInfo],
    shallow
  );

  const [title, setTitle] = useState("未命名文档");
  const [lastUpdateTimeText, setLastUpdateTimeText] = useState("");
  const [renderContent, setRenderContent] = useState("");

  const lastUpdateTimeRef = useRef(0);
  const textAreaRef = useRef(null);
  const linkRef = useRef(null);
  const wsRef = useRef<WebSocket>(null as any);
  const updateTimerRef = useRef<number>(null as any);

  const handleChangePermission = () => {};

  const content = (
    <div>
      <Input
        ref={linkRef}
        addonBefore={
          <Select
            defaultValue="获得链接的人可阅读"
            style={{ width: 200 }}
            onChange={handleChangePermission}
          >
            <Option value="可阅读">获得链接的人可阅读</Option>
            <Option value="可编辑">获得链接的人可编辑</Option>
          </Select>
        }
        suffix={
          <CopyToClipboard
            text={
              window.location.protocol +
              window.location.host +
              window.location.pathname +
              "?id=" +
              docInfo.id
            }
          >
            <span>双击复制链接</span>
          </CopyToClipboard>
        }
        value={
          window.location.protocol +
          window.location.host +
          window.location.pathname +
          "?id=" +
          docInfo.id
        }
      ></Input>
    </div>
  );

  const handleCollect = () => {
    console.log("collect");
  };

  // 不需要时刻更新时间，节流，0.2s触发一次时间更新
  const updateLastTime = useMemo(
    () =>
      throttling(() => {
        lastUpdateTimeRef.current = new Date().getTime();
      }, 200),
    []
  );

  const connectWebSocket = useCallback(() => {
    const ws = new window.WebSocket("ws://localhost:3002/");
    wsRef.current = ws;
    ws.onmessage = (event) => {
      console.log(`receive message: ${event.data}`);
      handleMessage(JSON.parse(event.data));
    };
    return () => {
      ws.close();
    };
  }, []);

  const handleMessage = useCallback(
    ({ delta, update_time }: { delta: Delta; update_time: number }) => {
      if (!delta) {
        return;
      }
      lastUpdateTimeRef.current = update_time;
      const { editorState, setEditorState } = useStore.getState();
      const raw = convertToRaw(editorState.getCurrentContent());
      const nextContentState = convertFromRaw(patch(raw, delta));
      setEditorState(
        EditorState.push(editorState, nextContentState, "change-block-type")
      );
    },
    []
  );

  const updateTimeText = useCallback(() => {
    const duration = new Date().getTime() - lastUpdateTimeRef.current;
    let value = 1,
      suffix = "min前";
    if (duration < 60000 * 60) {
      suffix = "min前";
      value = Math.floor(duration / 60000);
    } else if (duration >= 60000 * 60 && duration < 60000 * 60 * 24) {
      suffix = "hour前";
      value = Math.floor(duration / (60000 * 60));
    } else if (duration >= 60000 * 60 * 24 && duration < 60000 * 60 * 24 * 30) {
      suffix = "day前";
      value = Math.floor(duration / (60000 * 60 * 24));
    } else if (
      duration >= 60000 * 60 * 24 * 30 &&
      duration < 60000 * 60 * 24 * 30 * 12
    ) {
      suffix = "月前";
      value = Math.floor(duration / (60000 * 60 * 24 * 30));
    } else if (duration >= 60000 * 60 * 24 * 30 * 12) {
      suffix = "年前";
      value = Math.floor(duration / (60000 * 60 * 24 * 30 * 12));
    }
    const timeText = Math.max(value, 1) + suffix;
    setLastUpdateTimeText(timeText);
    // 每分钟更新最近修改时间
    updateTimerRef.current = setTimeout(updateTimeText, 60000);
    return () => {
      clearTimeout(updateTimerRef.current);
    };
  }, []);

  const createInitialDoc = useCallback(async () => {
    if (!userInfo) {
      return;
    }
    const editorState = useStore.getState().editorState;
    const docContent = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );
    const data = await createDoc({
      creator: userInfo.id,
      content: docContent,
      name: title,
    });
    if (data) {
      setDocInfo(data);
    }
  }, []);

  const getDocById = async () => {
    const doc = await getDocDetail({ id });
    if (doc) {
      setDocInfo(doc);
      setTitle(doc.name);
      const content = JSON.parse(doc.content);
      const contentState = convertFromRaw(content);
      setEditorState(
        EditorState.push(
          EditorState.createEmpty(),
          contentState,
          "change-block-type"
        )
      );
      return doc;
    }
  };

  useEffect(() => {
    if (id === undefined) {
      initEditorState();
    }
    const clearUpdateTimer = updateTimeText();

    if (id === undefined) {
      createInitialDoc();
    } else {
      getDocById().then((doc) => {
        lastUpdateTimeRef.current = new Date(doc.update_time).getTime();
        clearUpdateTimer();
        updateTimeText();
      });
    }

    // 建立websocket连接，订阅其他编辑者的更新
    const closeWebSocket = connectWebSocket();

    // TODO: 后端返回的文档信息会有lastUpdateTime，这里临时用7天内的随机时间
    const randomLastUpdateTime =
      new Date().getTime() - Math.ceil(Math.random() * 60000 * 60 * 24 * 7);

    return () => {
      closeWebSocket();
      clearUpdateTimer();
      setDocInfo(null as any);
      setEditorState(null as any);
    };
  }, []);

  useEffect(() => {
    if (Reflect.ownKeys(docInfo).length > 0 && title !== "未命名文档") {
      updateDoc({ id: docInfo.id, name: title });
    }
  }, [docInfo, title]);

  const saveManually = () => {
    const content = JSON.stringify(
      convertToRaw(editorState.getCurrentContent())
    );
    updateDoc({ id: docInfo.id, content });
  };

  const handleKeyCommand = (
    command: DraftEditorCommand,
    editorState: EditorState
  ) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  };

  const broadcast = debounce(
    (editorState: EditorState) => {
      const ws = wsRef.current;
      if (ws === null) {
        return;
      }
      ws.send(
        JSON.stringify({
          event: "doc",
          data: {
            docId: docInfo.id,
            raw: convertToRaw(editorState.getCurrentContent()),
          },
        })
      );
    },
    300,
    true
  );

  const handleEditorStateChange = useCallback(
    (editorState: EditorState) => {
      // 每次状态更新广播给其他编辑者
      broadcast(editorState);
      setEditorState(editorState);
      updateLastTime();
    },
    [docInfo]
  );

  return (
    <div>
      <TopTool>
        <InnerLeft>
          <LeftOutlined />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <DocsName
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></DocsName>
              <HoverIcon>
                <Tooltip placement="bottom" title="收藏该文章">
                  <StarOutlined onClick={handleCollect} />
                </Tooltip>
              </HoverIcon>
            </div>
            <LatestTime>
              {lastUpdateTimeText ? `最近修改: ${lastUpdateTimeText}` : ""}
            </LatestTime>
          </div>
        </InnerLeft>
        <InnerLeft>
          <Button
            type="primary"
            style={{
              borderRadius: "5px",
              marginRight: "20px",
            }}
            onClick={saveManually}
          >
            手动保存
          </Button>
          <Popover
            placement="bottom"
            title="链接分享"
            content={content}
            trigger="click"
          >
            <Button
              type="primary"
              style={{
                borderRadius: "5px",
                marginRight: "20px",
              }}
            >
              分享
            </Button>
          </Popover>
          <Divider type="vertical" style={{ height: "30px" }} />
          <HoverIcon>
            <Tooltip placement="bottom" title="搜索文字">
              <SearchOutlined style={ICON_STYLE} />
            </Tooltip>
          </HoverIcon>
          <HoverIcon>
            <Tooltip placement="bottom" title="新建文档">
              <PlusOutlined style={ICON_STYLE} />
            </Tooltip>
          </HoverIcon>
          <UserInfo></UserInfo>
        </InnerLeft>
      </TopTool>
      <Main>
        <NavBar></NavBar>
        <Divider type="vertical" style={{ height: "auto" }}></Divider>
        <Content ref={textAreaRef}>
          <ToolBar></ToolBar>
          <Editor
            blockStyleFn={myBlockStyleFn}
            // blockRendererFn={myBlockRenderer}
            customStyleMap={editorStyleMap}
            editorState={editorState}
            onChange={handleEditorStateChange}
            handleKeyCommand={handleKeyCommand}
            spellCheck={true}
            placeholder="Tell a story..."
          />
        </Content>
      </Main>
    </div>
  );
};

export default DocContent;
