import styled from "@emotion/styled";
import { useEffect, useRef } from "react";
import { Input } from "antd";

const LoginWrapper = styled.canvas`
  width: 100%;
  height: 100%;
`;

interface FiveStar {
  bigRadius: number;
  smallRadius: number;
  offsetX: number;
  offsetY: number;
  RotationAngle: number;
}

const Login = () => {
  const wrapperRef = useRef<HTMLCanvasElement>(null);
  //画一个五角星
  const drawFiveStar = (cxt: CanvasRenderingContext2D, fiveStar: FiveStar) => {
    cxt.beginPath();
    var x = 0,
      y = 0;
    for (var i = 0; i < 5; i++) {
      x = Math.cos(((18 + 72 * i - fiveStar.RotationAngle) / 180) * Math.PI);
      x = x * fiveStar.bigRadius + fiveStar.offsetX;
      y = -Math.sin(((18 + 72 * i - fiveStar.RotationAngle) / 180) * Math.PI);
      y = y * fiveStar.bigRadius + fiveStar.offsetY;
      cxt.lineTo(x, y);
      x = Math.cos(((54 + i * 72 - fiveStar.RotationAngle) / 180) * Math.PI);
      x = x * fiveStar.smallRadius + fiveStar.offsetX;
      y = -Math.sin(((54 + i * 72 - fiveStar.RotationAngle) / 180) * Math.PI);
      y = y * fiveStar.smallRadius + fiveStar.offsetY;
      cxt.lineTo(x, y);
    }
    cxt.closePath();
    cxt.lineWidth = 3;
    cxt.strokeStyle = "#FD5";
    cxt.fillStyle = "yellow";
    cxt.lineJoin = "round";
    cxt.fill();
    cxt.stroke();
  };
  useEffect(() => {
    const wrapperContent = wrapperRef.current!.getContext(
      "2d"
    ) as CanvasRenderingContext2D;
    if (wrapperRef.current) {
      wrapperContent.fillStyle = "white";
      wrapperContent.fillRect(
        0,
        0,
        wrapperRef.current.width,
        wrapperRef.current.height
      );
    }
    // 1s画一个小星星
    setInterval(() => {
      for (let i = 1; i <= 5; i++) {
        const fiveStar: FiveStar = {
          bigRadius: 0,
          smallRadius: 0,
          offsetX: 0,
          offsetY: 0,
          RotationAngle: 0,
        };
        fiveStar.bigRadius = Math.random() * 6 + 6;
        fiveStar.smallRadius = fiveStar.bigRadius / 2.0;
        fiveStar.offsetX = Math.random() * wrapperRef.current!.width;
        fiveStar.offsetY = Math.random() * wrapperRef.current!.height;
        fiveStar.RotationAngle = Math.random() * 360;
        drawFiveStar(wrapperContent, fiveStar);
      }
    }, 1000);
    //每10s清空一次画布
    setInterval(() => {
      wrapperContent.clearRect(
        0,
        0,
        wrapperRef.current!.width,
        wrapperRef.current!.height
      );
    }, 10000);
  }, []);

  return (
    <LoginWrapper ref={wrapperRef}>
      <Input placeholder="输入名称"></Input>
      <Input></Input>
    </LoginWrapper>
  );
};

export default Login;
