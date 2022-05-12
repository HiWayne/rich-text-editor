import { FC, MouseEventHandler, useCallback } from "react";
import styled from "@emotion/styled";
import { DraftInlineStyle, RichUtils } from "draft-js";
import useStore from "store/index";
// svg components of button's icon
// inline style
import BoldIcon from "assets/svg/bold.svg";
import ItalicIcon from "assets/svg/italic.svg";
import CodeIcon from "assets/svg/code.svg";
import UnderlineIcon from "assets/svg/underline.svg";
import DeleteIcon from "assets/svg/delete.svg";
// block style
import HeaderN from "./HeaderN";
import H1Icon from "assets/svg/h1.svg";
import H2Icon from "assets/svg/h2.svg";
import H3Icon from "assets/svg/h3.svg";
import H4Icon from "assets/svg/h4.svg";
import H5Icon from "assets/svg/h5.svg";
import H6Icon from "assets/svg/h6.svg";
import H7Icon from "assets/svg/h7.svg";
import H8Icon from "assets/svg/h8.svg";
import H9Icon from "assets/svg/h9.svg";
import BlockQuoteIcon from "assets/svg/quote.svg";
import UnorderedListIcon from "assets/svg/unorderedList.svg";
import OrderedListIcon from "assets/svg/orderedList.svg";
import CodeBlockIcon from "assets/svg/codeBlock.svg";

export enum EditorChangeType {
  "adjust-depth" = "adjust-depth",
  "apply-entity" = "apply-entity",
  "backspace-character" = "backspace-character",
  "change-block-data" = "change-block-data",
  "change-block-type" = "change-block-type",
  "change-inline-style" = "change-inline-style",
  "move-block" = "move-block",
  "delete-character" = "delete-character",
  "insert-characters" = "insert-characters",
  "insert-fragment" = "insert-fragment",
  "redo" = "redo",
  "remove-range" = "remove-range",
  "spellcheck-change" = "spellcheck-change",
  "split-block" = "split-block",
  "undo" = "undo",
}

enum StyleTypes {
  BLOCK,
  INLINE,
}

export enum TOOL_ITEM_NAMES {
  BOLD = "BOLD",
  ITALIC = "ITALIC",
  CODE = "CODE",
  STRIKE_THROUGH = "STRIKETHROUGH",
  UNDERLINE = "UNDERLINE",

  "HEADER_N" = "HEADER_N",
  "HEADER_ONE" = "header-one",
  "HEADER_TWO" = "header-two",
  "HEADER_THREE" = "header-three",
  "HEADER_FOUR" = "header-four",
  "HEADER_FIVE" = "header-five",
  "HEADER_SIX" = "header-six",
  "HEADER_SEVEN" = "header-seven",
  "HEADER_EIGHT" = "header-eight",
  "HEADER_NINE" = "header-nine",
  "BLOCK_QUOTE" = "blockquote",
  "UNORDERED_LIST" = "unordered-list-item",
  "ORDERED_LIST" = "ordered-list-item",
  "CODE_BLOCK" = "code-block",
}

interface ToolIconProps {
  className?: string;
  children: JSX.Element;
  styleType?: StyleTypes;
  modifyAction?: DraftInlineStyle;
  custom?: boolean;
  onMouseEnter?: MouseEventHandler;
  [key: string]: any;
}
export const ToolIcon: FC<ToolIconProps> = ({
  children,
  styleType,
  modifyAction,
  custom,
  onMouseEnter,
  ...props
}) => {
  const editorState = useStore((state) => state.editorState);

  let active: boolean = false;
  if (!custom) {
    if (styleType === StyleTypes.BLOCK) {
      const selection = editorState.getSelection();
      const currentBlockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();
      active = currentBlockType === (modifyAction as any);
    } else if (styleType === StyleTypes.INLINE) {
      const currentInlineStyle = editorState.getCurrentInlineStyle();
      active = currentInlineStyle.has(modifyAction as any);
    }
  } else {
    active = props.active;
  }

  const handleClick = useCallback(
    (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      if (styleType === StyleTypes.BLOCK) {
        toggleBlockStyle(modifyAction as any);
      } else if (styleType === StyleTypes.INLINE) {
        toggleInlineStyle(modifyAction as any);
      }
    },
    [styleType]
  );

  return (
    <ToolIconInner
      active={active}
      onClick={custom ? () => {} : handleClick}
      onMouseEnter={onMouseEnter}
      {...props}
    >
      {children}
    </ToolIconInner>
  );
};

interface ToolIconWrapperProps {
  className?: string;
  active: boolean;
  children: JSX.Element;
  onClick: (...args: any[]) => void;
  onMouseEnter?: MouseEventHandler;
}
const ToolIconInner = styled<FC<ToolIconWrapperProps>>(
  ({ className, onClick, children, active, onMouseEnter, ...props }) => {
    return (
      <span
        className={className}
        onMouseDown={onClick}
        onMouseEnter={onMouseEnter}
        {...props}
      >
        <span>{children}</span>
      </span>
    );
  }
)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 40px;
  font-size: 24px;
  line-height: 24px;
  & > span {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: 24px;
    background: ${(props) =>
      props.active ? "var(--udtoken-btn-text-bg-pri-hover)" : "transparent"};
  }
  & svg {
    border-radius: 6px;
    padding: 3px;
    box-sizing: border-box;
    color: ${(props) => (props.active ? "var(--B500)" : "var(--N80)")};
  }
  &:hover > span {
    background: ${(props) =>
      props.active
        ? "linear-gradient(180deg, var(--udtoken-btn-text-bg-pri-hover), var(--udtoken-btn-text-bg-pri-hover)), linear-gradient(180deg, var(--fill-tag), var(--udtoken-btn-text-bg-pri-hover))"
        : "var(--fill-tag)"};
  }
`;

const toggleBlockStyle = (modifyAction: string) => {
  const state = useStore.getState();
  const { editorState, setEditorState } = state;
  setEditorState(RichUtils.toggleBlockType(editorState, modifyAction));
};

const toggleInlineStyle = (modifyAction: string) => {
  const state = useStore.getState();
  const { editorState, setEditorState } = state;
  setEditorState(RichUtils.toggleInlineStyle(editorState, modifyAction));
};

export type ToolItemsType = {
  [key in TOOL_ITEM_NAMES]: ToolItemComponentObject;
};

interface ToolItemComponentObject {
  component: FC<{ onMouseEnter?: MouseEventHandler }>;
  hidden: boolean;
}

const createToolItemComponent =
  (styleType: StyleTypes) =>
  (modifyAction: TOOL_ITEM_NAMES) =>
  (SvgComponent: () => JSX.Element) =>
  (hidden: boolean = false) =>
    createToolItemComponentObject(
      ({ onMouseEnter }) => (
        <ToolIcon
          modifyAction={modifyAction as any}
          styleType={styleType}
          onMouseEnter={hidden ? undefined : onMouseEnter}
        >
          <SvgComponent></SvgComponent>
        </ToolIcon>
      ),
      hidden
    );

const createToolItemComponentObject = (
  component: FC<{ onMouseEnter?: MouseEventHandler }>,
  hidden: boolean = false
): ToolItemComponentObject => ({
  component,
  hidden,
});

// 在ToolItems中不可见
const hiddenToolItemObjectList: Partial<ToolItemsType> = {
  [TOOL_ITEM_NAMES.HEADER_FOUR]: createToolItemComponent(StyleTypes.BLOCK)(
    TOOL_ITEM_NAMES.HEADER_FOUR
  )(H4Icon)(true),
  [TOOL_ITEM_NAMES.HEADER_FIVE]: createToolItemComponent(StyleTypes.BLOCK)(
    TOOL_ITEM_NAMES.HEADER_FIVE
  )(H5Icon)(true),
  [TOOL_ITEM_NAMES.HEADER_SIX]: createToolItemComponent(StyleTypes.BLOCK)(
    TOOL_ITEM_NAMES.HEADER_SIX
  )(H6Icon)(true),
  // [TOOL_ITEM_NAMES.HEADER_SEVEN]: createToolItemComponent(StyleTypes.BLOCK)(
  //   TOOL_ITEM_NAMES.HEADER_SEVEN
  // )(H7Icon)(true),
  // [TOOL_ITEM_NAMES.HEADER_EIGHT]: createToolItemComponent(StyleTypes.BLOCK)(
  //   TOOL_ITEM_NAMES.HEADER_EIGHT
  // )(H8Icon)(true),
  // [TOOL_ITEM_NAMES.HEADER_NINE]: createToolItemComponent(StyleTypes.BLOCK)(
  //   TOOL_ITEM_NAMES.HEADER_NINE
  // )(H9Icon)(true),
};

const ToolItems: ToolItemsType = {
  [TOOL_ITEM_NAMES.BOLD]: createToolItemComponent(StyleTypes.INLINE)(
    TOOL_ITEM_NAMES.BOLD
  )(BoldIcon)(),
  [TOOL_ITEM_NAMES.ITALIC]: createToolItemComponent(StyleTypes.INLINE)(
    TOOL_ITEM_NAMES.ITALIC
  )(ItalicIcon)(),
  [TOOL_ITEM_NAMES.CODE]: createToolItemComponent(StyleTypes.INLINE)(
    TOOL_ITEM_NAMES.CODE
  )(CodeIcon)(),
  [TOOL_ITEM_NAMES.UNDERLINE]: createToolItemComponent(StyleTypes.INLINE)(
    TOOL_ITEM_NAMES.UNDERLINE
  )(UnderlineIcon)(),
  [TOOL_ITEM_NAMES.STRIKE_THROUGH]: createToolItemComponent(StyleTypes.INLINE)(
    TOOL_ITEM_NAMES.STRIKE_THROUGH
  )(DeleteIcon)(),

  [TOOL_ITEM_NAMES.HEADER_ONE]: createToolItemComponent(StyleTypes.BLOCK)(
    TOOL_ITEM_NAMES.HEADER_ONE
  )(H1Icon)(),
  [TOOL_ITEM_NAMES.HEADER_TWO]: createToolItemComponent(StyleTypes.BLOCK)(
    TOOL_ITEM_NAMES.HEADER_TWO
  )(H2Icon)(),
  [TOOL_ITEM_NAMES.HEADER_THREE]: createToolItemComponent(StyleTypes.BLOCK)(
    TOOL_ITEM_NAMES.HEADER_THREE
  )(H3Icon)(),

  // hover HeaderN 时，h4-h9可见；click HeaderN 时，消失
  [TOOL_ITEM_NAMES.HEADER_N]: createToolItemComponentObject(() => (
    <HeaderN>
      <>
        {Reflect.ownKeys(hiddenToolItemObjectList).map((key) => {
          const ToolItem =
            hiddenToolItemObjectList[key as keyof Partial<ToolItemsType>]!
              .component;
          return <ToolItem key={key as TOOL_ITEM_NAMES}></ToolItem>;
        })}
      </>
    </HeaderN>
  )),

  ...hiddenToolItemObjectList,

  [TOOL_ITEM_NAMES.BLOCK_QUOTE]: createToolItemComponent(StyleTypes.BLOCK)(
    TOOL_ITEM_NAMES.BLOCK_QUOTE
  )(BlockQuoteIcon)(),
  [TOOL_ITEM_NAMES.ORDERED_LIST]: createToolItemComponent(StyleTypes.BLOCK)(
    TOOL_ITEM_NAMES.ORDERED_LIST
  )(OrderedListIcon)(),
  [TOOL_ITEM_NAMES.UNORDERED_LIST]: createToolItemComponent(StyleTypes.BLOCK)(
    TOOL_ITEM_NAMES.UNORDERED_LIST
  )(UnorderedListIcon)(),
  [TOOL_ITEM_NAMES.CODE_BLOCK]: createToolItemComponent(StyleTypes.BLOCK)(
    TOOL_ITEM_NAMES.CODE_BLOCK
  )(CodeBlockIcon)(),
};

export default ToolItems;
