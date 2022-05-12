import { CSSProperties, FC, Ref, RefObject, useRef } from "react";
import { Tooltip } from "antd";
import styled from "@emotion/styled";
import { MD_TOOLS_DATA } from "./mdToolData";

const LittleTool = styled.div`
  font-size: 18px;
  &:not(:first-of-type) {
    margin-left: 10px;
  }
  cursor: pointer;
`;
const Wrapper = styled.div`
  width: 250px;
  background: #ffffff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

interface MdToolsProps {
  style: CSSProperties;
  currentRef: RefObject<HTMLElement>;
  textAreaRef: RefObject<HTMLElement>;
  nextLine: { value: string };
}

const MdTools: FC<MdToolsProps> = ({
  style,
  currentRef,
  textAreaRef,
  nextLine,
}) => {
  const countRef = useRef(0);
  const changeStyle = (desc: string) => {
    switch (desc) {
      case "一级标题": {
        (currentRef.current as HTMLElement).style.fontSize = 35 + "px";
        break;
      }
      case "二级标题": {
        (currentRef.current as HTMLElement).style.fontSize = 28 + "px";
        break;
      }
      case "三级标题": {
        (currentRef.current as HTMLElement).style.fontSize = 22 + "px";
        break;
      }
      case "有序列表": {
        countRef.current++;
        (currentRef.current as HTMLElement).value =
          countRef.current + ".  " + (currentRef.current as HTMLElement).value;
        break;
      }
      case "无序列表": {
        console.log(nextLine.value);
        nextLine.value = ".";
        (currentRef.current as HTMLElement) = document.createElement("ul");
        (currentRef.current as HTMLElement).style.listStyle = "circle";
        break;
      }
      case "右对齐": {
        textAreaRef.current.style.marginRight = 0;
        break;
      }
      case "左对齐": {
        textAreaRef.current.style.marginLeft = 0;
        break;
      }
      case "居中对齐": {
        textAreaRef.current.style.margin = "0 auto";

        break;
      }
      default: {
        style = {
          fontSize: "12px",
        };
      }
    }
    return;
  };
  return (
    <Wrapper>
      {MD_TOOLS_DATA.map(({ data, desc }, index) => (
        <LittleTool key={index} onClick={() => changeStyle(desc)}>
          <Tooltip placement="bottom" title={desc} trigger="hover">
            {data}
          </Tooltip>
        </LittleTool>
      ))}
    </Wrapper>
  );
};

export default MdTools;
