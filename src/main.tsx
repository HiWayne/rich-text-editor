import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "antd/dist/antd.css";
import 'draft-js/dist/Draft.css';

ReactDOM.createRoot(document.getElementById("root") as Element).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
