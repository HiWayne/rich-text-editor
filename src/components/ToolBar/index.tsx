import ToolItems, { ToolItemsType, TOOL_ITEM_NAMES } from "./ToolItems";
import useStore from "store/index";
import shallow from "zustand/shallow";
import { useCallback } from "react";
import styled from "@emotion/styled";

const toolItemKeyList = Reflect.ownKeys(ToolItems) as (keyof ToolItemsType)[];

const ToolListWrapper = styled.div`
  width: auto;
  padding: 0 6px;
  background-color: var(--bg-float);
  border-radius: 6px;
  border: 1px solid var(--line-border-card);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const ToolBar = () => {
  const [showMoreTools, setShowMoreTools] = useStore(
    (state) => [state.showMoreTools, state.setShowMoreTools],
    shallow
  );

  // 其他tools发生mouseOver时，出现的隐藏tools消失
  const ifHoverOtherTools = useCallback(() => {
    if (showMoreTools) {
      setShowMoreTools(!showMoreTools);
    }
  }, [showMoreTools]);

  return (
    <ToolListWrapper>
      {toolItemKeyList
        .filter((toolItemKey) => !ToolItems[toolItemKey].hidden)
        .map((toolItemKey) => {
          const { component: ToolItem } = ToolItems[toolItemKey];
          return (
            <ToolItem
              key={toolItemKey}
              onMouseEnter={ifHoverOtherTools}
            ></ToolItem>
          );
        })}
    </ToolListWrapper>
  );
};

export default ToolBar;
