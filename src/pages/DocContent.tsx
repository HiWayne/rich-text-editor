import {
  ChangeEventHandler,
  ReactEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

const DocsTitle = styled.input`
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
 * @description ???????????????????????????
 * inline: ?????? bold????????? i???????????????????????????????????????????????????????????????????????????
 * block: ?????? H1-H9????????????????????????????????????????????????????????????????????????????????????????????????????????????
 *
 */

const DocContent = () => {
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

  const [title, setTitle] = useState("???????????????");
  const [lastUpdateTimeText, setLastUpdateTimeText] = useState("");

  // ????????????????????????????????????
  const updateTimerRef = useRef<number | null>(null);
  // ????????????????????????
  const lastUpdateTimeRef = useRef(0);
  const wsRef = useRef<WebSocket>(null as any);

  const handleChangePermission = () => {};

  const handleCopied = useCallback(() => {}, []);

  const shareUrl = useMemo(
    () =>
      window.location.protocol +
      window.location.host +
      window.location.pathname +
      "?id=" +
      docInfo.id,
    [docInfo.id]
  );

  const content = (
    <div>
      <Input
        addonBefore={
          <Select
            defaultValue="???????????????????????????"
            style={{ width: 200 }}
            onChange={handleChangePermission}
          >
            <Option value="?????????">???????????????????????????</Option>
            <Option value="?????????">???????????????????????????</Option>
          </Select>
        }
        suffix={
          <Tooltip title="????????????" trigger="click">
            <CopyToClipboard text={shareUrl}>
              <span style={{ cursor: "pointer" }}>??????????????????</span>
            </CopyToClipboard>
          </Tooltip>
        }
        value={shareUrl}
      ></Input>
    </div>
  );

  const handleCollect = () => {
    console.log("collect");
  };

  // ???????????????????????????????????????0.1s????????????????????????
  const updateLastTime = useMemo(
    () =>
      throttling(() => {
        updateTimeText();
      }, 100),
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
      updateTimeText();
      const { editorState, setEditorState } = useStore.getState();
      const raw = convertToRaw(editorState.getCurrentContent());
      const nextContentState = convertFromRaw(patch(raw, delta));
      setEditorState(
        EditorState.push(editorState, nextContentState, "change-block-type")
      );
    },
    []
  );

  // ?????????????????????????????????
  // 1. ??????????????????
  // 2. ??????????????????
  const updateTimeText = useCallback(() => {
    const currentTime = new Date().getTime();
    const duration = currentTime - lastUpdateTimeRef.current;
    lastUpdateTimeRef.current = currentTime;
    let value = 1,
      suffix = "min???";
    if (duration < 60000 * 60) {
      suffix = "min???";
      value = Math.floor(duration / 60000);
    } else if (duration >= 60000 * 60 && duration < 60000 * 60 * 24) {
      suffix = "hour???";
      value = Math.floor(duration / (60000 * 60));
    } else if (duration >= 60000 * 60 * 24 && duration < 60000 * 60 * 24 * 30) {
      suffix = "day???";
      value = Math.floor(duration / (60000 * 60 * 24));
    } else if (
      duration >= 60000 * 60 * 24 * 30 &&
      duration < 60000 * 60 * 24 * 30 * 12
    ) {
      suffix = "??????";
      value = Math.floor(duration / (60000 * 60 * 24 * 30));
    } else if (duration >= 60000 * 60 * 24 * 30 * 12) {
      suffix = "??????";
      value = Math.floor(duration / (60000 * 60 * 24 * 30 * 12));
    }
    const timeText = Math.max(value, 1) + suffix;
    if (lastUpdateTimeText === timeText) {
      return;
    }
    setLastUpdateTimeText(timeText);
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
    if (id === undefined) {
      createInitialDoc();
    } else {
      getDocById().then((doc) => {
        lastUpdateTimeRef.current = new Date(doc.update_time).getTime();
        updateTimeText();
      });
    }

    // ??????websocket???????????????????????????????????????
    const closeWebSocket = connectWebSocket();

    return () => {
      closeWebSocket();
      setDocInfo(null as any);
      setEditorState(null as any);
    };
  }, []);

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
      // ??????????????????????????????????????????
      broadcast(editorState);
      setEditorState(editorState);
      updateLastTime();
    },
    [docInfo]
  );

  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const title = e.target.value;
    const params = { id: docInfo.id, name: title };
    updateDoc(params);
  };

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
              <DocsTitle
                value={title}
                onChange={handleTitleChange}
              ></DocsTitle>
              <HoverIcon>
                <Tooltip placement="bottom" title="???????????????">
                  <StarOutlined onClick={handleCollect} />
                </Tooltip>
              </HoverIcon>
            </div>
            <LatestTime>
              {lastUpdateTimeText ? `????????????: ${lastUpdateTimeText}` : ""}
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
            ????????????
          </Button>
          <Popover
            placement="bottom"
            title="????????????"
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
              ??????
            </Button>
          </Popover>
          <Divider type="vertical" style={{ height: "30px" }} />
          <HoverIcon>
            <Tooltip placement="bottom" title="????????????">
              <SearchOutlined style={ICON_STYLE} />
            </Tooltip>
          </HoverIcon>
          <HoverIcon>
            <Tooltip placement="bottom" title="????????????">
              <PlusOutlined style={ICON_STYLE} />
            </Tooltip>
          </HoverIcon>
          <UserInfo></UserInfo>
        </InnerLeft>
      </TopTool>
      <Main>
        <NavBar></NavBar>
        <Divider type="vertical" style={{ height: "auto" }}></Divider>
        <Content>
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
