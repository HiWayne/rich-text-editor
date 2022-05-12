import { ToolIcon } from "./ToolItems";
import Hn from "assets/svg/hn.svg";
import DownArrow from "assets/svg/downArrow.svg";
import styled from "@emotion/styled";
import { FC, MouseEventHandler, useCallback, useRef } from "react";
import useStore from "store/index";
import shallow from "zustand/shallow";

const HeaderNWrapper = styled.div`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

interface RotateWrapperProps {
  className?: string;
  showMoreTools: boolean;
  children: JSX.Element;
}

const RotateWrapper = styled<FC<RotateWrapperProps>>(
  ({ className, children }) => <span className={className}>{children}</span>
)`
  transform: ${(props) => (props.showMoreTools ? "rotate(180deg)" : "rotate(0deg)")};
  transition: all 0.2s ease-in;
`;

interface HiddenToolsProps {
  className?: string;
  showMoreTools: boolean;
  children: JSX.Element;
}

const HiddenTools = styled<FC<HiddenToolsProps>>(({ className, children }) => (
  <div className={className}>{children}</div>
))`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 0;
  transform: ${(props) =>
    props.showMoreTools
      ? "translate(-50%, -100%)"
      : "translate(-50%, calc(-100% - 20px))"};
  padding: 0 6px;
  border-radius: 6px;
  border: 1px solid var(--line-border-card);
  opacity: ${(props) => (props.showMoreTools ? 1 : 0)};
  transition: all 0.2s ease-in;
  font-size: 24px;
  background: #fff;
`;

interface HeaderNProps {
  children: JSX.Element;
}

const HeaderN: FC<HeaderNProps> = ({ children }) => {
  const [showMoreTools, setShowMoreTools] = useStore(
    (state) => [state.showMoreTools, state.setShowMoreTools],
    shallow
  );

  const timerRef = useRef(null as any);

  const delayTriggerShowMore = useCallback<MouseEventHandler<HTMLDivElement>>(
    () => {
      timerRef.current = setTimeout(() => {
        setShowMoreTools(true);
      }, 100);
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return (
    <HeaderNWrapper
      onMouseEnter={delayTriggerShowMore}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        const showMoreTools = useStore.getState().showMoreTools;
        setShowMoreTools(!showMoreTools);
      }}
    >
      <ToolIcon custom active={false} style={{ marginLeft: "8px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Hn></Hn>
          <RotateWrapper showMoreTools={showMoreTools}>
            <DownArrow></DownArrow>
          </RotateWrapper>
        </div>
      </ToolIcon>
      <HiddenTools showMoreTools={showMoreTools}>{children}</HiddenTools>
    </HeaderNWrapper>
  );
};

export default HeaderN;
