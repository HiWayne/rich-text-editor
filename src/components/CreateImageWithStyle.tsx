import {
  FC,
  MouseEventHandler,
  CSSProperties,
} from "react";

interface CreateImageWithStyleProps {
  url: string;
  className: string;
  style: CSSProperties;
  click: MouseEventHandler<HTMLImageElement>;
}
const CreateImageWithStyle: FC<CreateImageWithStyleProps> = ({
  url,
  className,
  style,
  click,
}) => {
  if (!url) {
    return null;
  }
  return (
    <img
      src={url}
      className={className}
      style={{
        objectFit: "cover",
        objectPosition: "center",
        width: "3rem",
        height: "3rem",
        ...style,
      }}
      onClick={click}
      alt=""
    ></img>
  );
};
export default CreateImageWithStyle;
