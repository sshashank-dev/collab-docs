import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
} from "react-router-dom";

import api from "./api";
import Dashboard from "./Dashboard";
import DocumentEditor from "./DocumentEditor";
import Register from "./Register";
import Login from "./Login";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";


/* =========================================================
   SHARED COLLABORATIVE EDITOR
========================================================= */

function SharedCollaborativeEditor({
  document,
  permission,
}) {
  const [accessRevoked, setAccessRevoked] =
    useState(false);

  const [connectionStatus, setConnectionStatus] =
    useState("connecting");

  const [isSynced, setIsSynced] =
    useState(false);

  const [saveStatus, setSaveStatus] =
    useState("saved");

  const ydoc = useMemo(
    () => new Y.Doc(),
    []
  );

  const provider = useMemo(
    () =>
      new WebsocketProvider(
        import.meta.env.VITE_COLLAB_URL || "ws://localhost:1234",
        `document-${document._id}`,
        ydoc,
        {
          connect: true,
        }
      ),
    [document._id, ydoc]
  );

  useEffect(() => {
    const awareness = provider.awareness;

    const handleStatus = (event) => {
      setConnectionStatus(
        event.status
      );

      if (
        event.status === "connected"
      ) {
        setSaveStatus("saved");
      }
    };

    const handleSynced = (synced) => {
      setIsSynced(synced);

      if (synced) {
        setSaveStatus("saved");
      }
    };

    const handleClosed = (event) => {
      const code =
        event?.code;

      if (
        code >= 4400 &&
        code <= 4499
      ) {
        setAccessRevoked(true);
        setIsSynced(false);
        setConnectionStatus(
          "revoked"
        );
        setSaveStatus("error");
      }
    };

    provider.on(
      "status",
      handleStatus
    );

    provider.on(
      "sync",
      handleSynced
    );

    provider.on(
      "connection-close",
      handleClosed
    );

    return () => {
      provider.off(
        "status",
        handleStatus
      );

      provider.off(
        "sync",
        handleSynced
      );

      provider.off(
        "connection-close",
        handleClosed
      );

      provider.destroy();
      ydoc.destroy();
    };
  }, [provider, ydoc]);

  useEffect(() => {
    if (
      !accessRevoked &&
      permission === "editor"
    ) {
      return;
    }
  }, [
    accessRevoked,
    permission,
  ]);

  return null;
}


/* =========================================================
   SHARED DOCUMENT
========================================================= */

function SharedDocument() {
  const { token } = useParams();

  const [document, setDocument] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadSharedDocument =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await api.get(
              `/documents/share/${token}`
            );

          setDocument(
            response.data.document
          );
        } catch (error) {
          console.error(
            "Failed to load shared document:",
            error
          );

          setError(
            error.response?.data
              ?.message ||
            "This share link is invalid or has expired."
          );
        } finally {
          setLoading(false);
        }
      };

    if (token) {
      loadSharedDocument();
    }
  }, [token]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily:
            "Arial, sans-serif",
          color: "#555",
        }}
      >
        Loading document...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily:
            "Arial, sans-serif",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "420px",
          }}
        >
          <h1
            style={{
              marginBottom: "10px",
              color: "#111827",
            }}
          >
            Unable to open document
          </h1>

          <p
            style={{
              color: "#6b7280",
              lineHeight: 1.6,
            }}
          >
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!document) {
    return null;
  }

  return (
    <SharedCollaborativeEditor
      document={document}
      permission={
        document.permission ||
        document.shareLink?.role ||
        "viewer"
      }
    />
  );
}


/* =========================================================
   MAIN APP
========================================================= */

function App() {
  const token =
    localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>

        {/* =================================================
                    LOGIN / DASHBOARD
                ================================================= */}

        <Route
          path="/"
          element={
            token ? (
              <Dashboard />
            ) : (
              <Login />
            )
          }
        />

        {/* =================================================
                    REGISTER
                ================================================= */}

        <Route
          path="/register"
          element={
            <Register />
          }
        />

        {/* =================================================
                    PRIVATE DOCUMENT
                ================================================= */}

        <Route
          path="/document/:id"
          element={
            token ? (
              <DocumentEditor />
            ) : (
              <Login />
            )
          }
        />

        {/* =================================================
                    PUBLIC SHARE LINK
                ================================================= */}

        <Route
          path="/share/:token"
          element={
            <SharedDocument />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;