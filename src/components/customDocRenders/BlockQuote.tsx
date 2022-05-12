import { FC } from "react";
import { ContentBlock, ContentState } from "draft-js";
import styled from "@emotion/styled";

interface BlockQuoteProps {
  block: ContentBlock;
  contentState: ContentState;
  blockProps?: Record<string, any>;
}

const BlockQuoteWrapper = styled.div`
  padding-left: 14px;
  margin: 8px 0;
  position: relative;
  color: rgba(var(--text-title-raw), 0.7);
  font-size: 16px;
  line-height: 1.625;
  &::before {
    content: '';
    display: block;
    height: 100%;
    border-left: 2px solid var(--udtoken-quote-bar-bg);
    border-radius: 1px;
    position: absolute;
    left: 0;
    top: 0;
  }
`

const BlockQuote: FC<BlockQuoteProps> = ({ block, contentState }) => {
  const data = contentState.getEntity(block.getEntityAt(0)).getData()
  return <BlockQuoteWrapper>{data}</BlockQuoteWrapper>;
};

export default BlockQuote;
