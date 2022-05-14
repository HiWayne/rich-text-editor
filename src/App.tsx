import { Routes, Route } from "react-router-dom";
import { Global } from "@emotion/react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import DocContent from "./pages/DocContent";
import useAuthority from "./shared/hooks/useAuthority";
import { Dispatch, SetStateAction } from "react";

function App() {
  const [hasPermission, setPermission] = useAuthority();
  return (
    <div className="App">
      <Global
        styles={{
          ":root": {
            "--N00": "#fff",
            "--N80": "#2b2f36",
            "--B500": "#3370ff",
            "--B500-raw": "51,112,255",
            "--N900": "#1f2329",
            "--N900-raw": "31,35,41",
            "--N300": "#dee0e3",
            "--N50": "#f5f6f7",
            "--udtoken-btn-text-bg-pri-hover": "rgba(var(--B500-raw), 0.1)",
            "--fill-tag": "rgba(var(--N900-raw), 0.08)",
            "--line-border-card": "var(--N300)",
            "--bg-body-overlay": "var(--N50)",
            "--text-title": "var(--N900)",
            "--text-title-raw": "var(--N900-raw)",
            "--udtoken-quote-bar-bg": "#bbbfc3",
            "--bg-float": "var(--N00)",
          },
          body: {
            fontSize: "16px",
            color: "var(--text-title)",
          },
          ".customBlockquote": {
            paddingLeft: "14px",
            margin: "8px 0",
            position: "relative",
            color: "rgba(var(--text-title-raw), 0.7)",
            fontSize: "16px",
            lineHeight: 1.625,
            "&::before": {
              content: "''",
              display: "block",
              height: "100%",
              borderLeft: "2px solid var(--udtoken-quote-bar-bg)",
              borderRadius: "1px",
              position: "absolute",
              left: 0,
              top: 0,
            },
          },
          ".DraftEditor-root .public-DraftStyleDefault-pre": {
            borderRadius: "6px",
            backgroundColor: "#292e3e",
            fontFamily: "'Inconsolata', 'Menlo', 'Consolas', monospace",
            fontSize: "16px",
            padding: "20px",
          },
        }}
      ></Global>
      <Routes>
        <Route
          path="/"
          element={
            hasPermission ? (
              <Home />
            ) : (
              <Login
                setPermission={
                  setPermission as Dispatch<SetStateAction<boolean>>
                }
              />
            )
          }
        />
        <Route
          path="/login"
          element={
            <Login
              setPermission={setPermission as Dispatch<SetStateAction<boolean>>}
            />
          }
        />
        {hasPermission ? (
          <>
            <Route path="/doc/create" element={<DocContent />} />
          </>
        ) : null}
      </Routes>
    </div>
  );
}

export default App;
