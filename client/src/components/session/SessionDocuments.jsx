import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiDownload,
  FiEdit3,
  FiExternalLink,
  FiFileText,
  FiTrash2,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import "./SessionDocuments.css";

function SessionDocuments({ sessionId, isTeacher }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);

  // Separate loading error from action errors
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState(null);

  const [uploadMessage, setUploadMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [renameMessage, setRenameMessage] = useState("");

  const [modal, setModal] = useState({
    open: false,
    type: "",
    document: null,
  });

  const [renameValue, setRenameValue] = useState("");

  const fileInputRef = useRef(null);

  // =====================================================
  // SUPPORTED FILE TYPES
  // =====================================================

  const supportedExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".txt",
    ".ppt",
    ".pptx",
  ];
  const MAX_FILE_SIZE = 25 * 1024 * 1024;

  const supportedFileNames = "PDF, DOC, DOCX, TXT, PPT, or PPTX";

  // =====================================================
  // FETCH DOCUMENTS
  // =====================================================

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError("");

      const token = localStorage.getItem("token");

      const res = await axios.get(`/api/documents/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDocuments(res.data);
    } catch (err) {
      console.error("Fetch documents error:", err);

      setLoadError(
        err.response?.data?.message || "Failed to load class materials.",
      );
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId) {
      fetchDocuments();
    }
  }, [sessionId, fetchDocuments]);

  // =====================================================
  // CLEAR MESSAGES
  // =====================================================

  const clearMessages = () => {
    setActionError(null);
    setUploadMessage("");
    setDeleteMessage("");
    setRenameMessage("");
  };

  // =====================================================
  // FILE URL
  // =====================================================

  const getFileUrl = (fileUrl) => {
    if (!fileUrl) return "";

    if (fileUrl.startsWith("http")) {
      return fileUrl;
    }

    return `http://localhost:5000${fileUrl}`;
  };

  // =====================================================
  // OPEN DOCUMENT
  // =====================================================

  const handleOpen = (fileUrl) => {
    clearMessages();

    const url = getFileUrl(fileUrl);

    if (!url) {
      setActionError({
        title: "Open failed",
        message: "Unable to open this document.",
      });

      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  // =====================================================
  // DOWNLOAD DOCUMENT
  // =====================================================

  const handleDownload = async (document) => {
    try {
      clearMessages();

      const token = localStorage.getItem("token");

      const response = await axios.get(getFileUrl(document.fileUrl), {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blobUrl = window.URL.createObjectURL(new Blob([response.data]));

      const link = window.document.createElement("a");

      link.href = blobUrl;
      link.download = document.fileName;

      window.document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download error:", err);

      setActionError({
        title: "Download failed",
        message: "Failed to download this document. Please try again.",
      });
    }
  };

  // =====================================================
  // OPEN FILE SELECTOR
  // =====================================================

  const handleUploadClick = () => {
    clearMessages();

    fileInputRef.current?.click();
  };

  // =====================================================
  // UPLOAD DOCUMENT
  // =====================================================

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    // Allow the same file to be selected again
    event.target.value = "";

    if (!file) {
      return;
    }

    clearMessages();

    if (file.size > MAX_FILE_SIZE) {
      setActionError({
        title: "Upload failed",
        message: `"${file.name}" is too large. Maximum file size is 25 MB.`,
      });
      return;
    }

    // -----------------------------------------------------
    // CHECK FILE EXTENSION
    // -----------------------------------------------------

    const fileName = file.name.toLowerCase();

    const isSupported = supportedExtensions.some((extension) =>
      fileName.endsWith(extension),
    );

    if (!isSupported) {
      setActionError({
        title: "Upload failed",
        message: `"${file.name}" is not supported. Please upload ${supportedFileNames} files.`,
      });

      return;
    }

    try {
      setUploading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("file", file);
      formData.append("sessionId", sessionId);

      const res = await axios.post("/api/documents", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDocuments((prev) => [res.data, ...prev]);

      setUploadMessage(`"${file.name}" uploaded successfully.`);
    } catch (err) {
      console.error("Upload error:", err);

      const serverMessage = err.response?.data?.message;

      setActionError({
        title: "Upload failed",
        message:
          serverMessage ||
          `Please make sure the file is a supported type: ${supportedFileNames}.`,
      });
    } finally {
      setUploading(false);
    }
  };

  // =====================================================
  // DELETE MODAL
  // =====================================================

  const openDeleteModal = (document) => {
    clearMessages();

    setModal({
      open: true,
      type: "delete",
      document,
    });
  };

  // =====================================================
  // RENAME MODAL
  // =====================================================

  const openRenameModal = (document) => {
    clearMessages();

    setRenameValue(document.fileName);

    setModal({
      open: true,
      type: "rename",
      document,
    });
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    if (deletingId || renamingId) {
      return;
    }

    setModal({
      open: false,
      type: "",
      document: null,
    });

    setRenameValue("");
  };

  // =====================================================
  // DELETE DOCUMENT
  // =====================================================

  const handleDelete = async () => {
    const document = modal.document;

    if (!document) {
      return;
    }

    try {
      setDeletingId(document._id);

      setActionError(null);
      setDeleteMessage("");

      const token = localStorage.getItem("token");

      await axios.delete(`/api/documents/${document._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDocuments((prev) => prev.filter((item) => item._id !== document._id));

      setDeleteMessage(`"${document.fileName}" was deleted successfully.`);

      setModal({
        open: false,
        type: "",
        document: null,
      });
    } catch (err) {
      console.error("Delete error:", err);

      setActionError({
        title: "Delete failed",
        message:
          err.response?.data?.message || "Delete failed. Please try again.",
      });
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================================
  // RENAME DOCUMENT
  // =====================================================

  const handleRename = async () => {
    const document = modal.document;

    if (!document) {
      return;
    }

    const trimmedName = renameValue.trim();

    if (!trimmedName) {
      setActionError({
        title: "Rename failed",
        message: "Document name cannot be empty.",
      });

      return;
    }

    if (trimmedName.length > 150) {
      setActionError({
        title: "Rename failed",
        message: "Document name must be 150 characters or less.",
      });

      return;
    }

    try {
      setRenamingId(document._id);

      setActionError(null);
      setRenameMessage("");

      const token = localStorage.getItem("token");

      const res = await axios.put(
        `/api/documents/${document._id}`,
        {
          fileName: trimmedName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setDocuments((prev) =>
        prev.map((item) => (item._id === document._id ? res.data : item)),
      );

      setRenameMessage(`Document renamed to "${trimmedName}".`);

      setModal({
        open: false,
        type: "",
        document: null,
      });

      setRenameValue("");
    } catch (err) {
      console.error("Rename error:", err);

      setActionError({
        title: "Rename failed",
        message:
          err.response?.data?.message || "Rename failed. Please try again.",
      });
    } finally {
      setRenamingId(null);
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-GB");
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      <div className="session-documents-card">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className="session-documents-header">
          <div className="session-documents-title-area">
            <div className="session-documents-icon">
              <FiFileText />
            </div>

            <div>
              <h3>Class Materials</h3>

              <p>Documents and notes shared for this session</p>
            </div>
          </div>

          <div className="documents-header-actions">
            <span className="documents-count">
              {documents.length}{" "}
              {documents.length === 1 ? "Document" : "Documents"}
            </span>

            {isTeacher && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="document-file-input"
                  accept=".pdf,.doc,.docx,.txt,.ppt,.pptx"
                  onChange={handleUpload}
                />

                <button
                  type="button"
                  className="upload-material-btn"
                  onClick={handleUploadClick}
                  disabled={uploading}
                >
                  <FiUploadCloud />

                  {uploading ? "Uploading..." : "Upload Material"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* =================================================
            SUCCESS MESSAGES
        ================================================= */}

        {uploadMessage && (
          <div className="document-success-message">
            <FiCheckCircle />

            <span>{uploadMessage}</span>
          </div>
        )}

        {deleteMessage && (
          <div className="document-success-message">
            <FiCheckCircle />

            <span>{deleteMessage}</span>
          </div>
        )}

        {renameMessage && (
          <div className="document-success-message">
            <FiCheckCircle />

            <span>{renameMessage}</span>
          </div>
        )}

        {/* =================================================
            ACTION ERROR
        ================================================= */}

        {actionError && (
          <div className="document-error-message">
            <FiAlertCircle />

            <div>
              <strong>{actionError.title}</strong>

              <span>{actionError.message}</span>
            </div>

            <button
              type="button"
              className="document-error-close"
              onClick={() => setActionError(null)}
              title="Close"
            >
              <FiX />
            </button>
          </div>
        )}

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="session-documents-content">
          {/* LOADING */}

          {loading ? (
            <div className="documents-loading">
              <span className="documents-spinner"></span>
              Loading class materials...
            </div>
          ) : /* REAL LOAD ERROR ONLY */

          loadError ? (
            <div className="documents-error">
              <FiAlertCircle />

              {loadError}
            </div>
          ) : /* EMPTY */

          documents.length === 0 ? (
            <div className="documents-empty">
              <div className="documents-empty-icon">
                <FiFileText />
              </div>

              <h4>No class materials yet</h4>

              <p>
                {isTeacher
                  ? `Upload ${supportedFileNames} files to share materials with your learner.`
                  : "The teacher has not uploaded any class materials yet."}
              </p>

              {isTeacher && (
                <button
                  type="button"
                  className="empty-upload-btn"
                  onClick={handleUploadClick}
                  disabled={uploading}
                >
                  <FiUploadCloud />
                  Upload Material
                </button>
              )}
            </div>
          ) : (
            /* DOCUMENT LIST */

            <div className="documents-list">
              {documents.map((document) => (
                <div className="document-item" key={document._id}>
                  <div className="document-main">
                    <div className="document-file-icon">
                      <FiFileText />
                    </div>

                    <div className="document-info">
                      <h4 title={document.fileName}>{document.fileName}</h4>

                      <span>Added {formatDate(document.createdAt)}</span>
                    </div>
                  </div>

                  <div className="document-actions">
                    {/* OPEN */}

                    <button
                      type="button"
                      className="document-action-btn"
                      onClick={() => handleOpen(document.fileUrl)}
                      title="Open document"
                    >
                      <FiExternalLink />
                      <span>Open</span>
                    </button>

                    {/* DOWNLOAD */}

                    <button
                      type="button"
                      className="document-action-btn"
                      onClick={() => handleDownload(document)}
                      title="Download document"
                    >
                      <FiDownload />
                      <span>Download</span>
                    </button>

                    {/* RENAME */}

                    {isTeacher && (
                      <button
                        type="button"
                        className="document-action-btn document-rename-btn"
                        onClick={() => openRenameModal(document)}
                        disabled={
                          renamingId === document._id ||
                          deletingId === document._id
                        }
                        title="Rename document"
                      >
                        <FiEdit3 />
                        <span>Rename</span>
                      </button>
                    )}

                    {/* DELETE */}

                    {isTeacher && (
                      <button
                        type="button"
                        className="document-action-btn document-delete-btn"
                        onClick={() => openDeleteModal(document)}
                        disabled={
                          deletingId === document._id ||
                          renamingId === document._id
                        }
                        title="Delete document"
                      >
                        <FiTrash2 />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===================================================
          CUSTOM MODAL
      =================================================== */}

      {modal.open && (
        <div
          className="document-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deletingId &&
              !renamingId
            ) {
              closeModal();
            }
          }}
        >
          <div className="document-modal">
            {/* =================================================
                RENAME MODAL
            ================================================= */}

            {modal.type === "rename" && (
              <>
                <div className="document-modal-icon rename">
                  <FiEdit3 />
                </div>

                <div className="document-modal-content">
                  <h3>Rename Document</h3>

                  <p>Enter a new name for this document.</p>

                  <input
                    type="text"
                    value={renameValue}
                    onChange={(event) => {
                      setRenameValue(event.target.value);

                      setActionError(null);
                    }}
                    autoFocus
                    maxLength={150}
                    className="document-rename-input"
                    placeholder="Enter document name"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleRename();
                      }

                      if (event.key === "Escape" && !renamingId) {
                        closeModal();
                      }
                    }}
                  />

                  {actionError && actionError.title === "Rename failed" && (
                    <div className="modal-inline-error">
                      <FiAlertCircle />
                      {actionError.message}
                    </div>
                  )}
                </div>

                <div className="document-modal-actions">
                  <button
                    type="button"
                    className="document-modal-cancel"
                    onClick={closeModal}
                    disabled={!!renamingId}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="document-modal-primary"
                    onClick={handleRename}
                    disabled={!!renamingId || !renameValue.trim()}
                  >
                    {renamingId ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </>
            )}

            {/* =================================================
                DELETE MODAL
            ================================================= */}

            {modal.type === "delete" && (
              <>
                <div className="document-modal-icon delete">
                  <FiTrash2 />
                </div>

                <div className="document-modal-content">
                  <h3>Delete Document?</h3>

                  <p>
                    Are you sure you want to delete
                    <strong> "{modal.document?.fileName}"</strong>?
                  </p>

                  <span className="document-modal-warning">
                    This action cannot be undone.
                  </span>

                  {actionError && actionError.title === "Delete failed" && (
                    <div className="modal-inline-error">
                      <FiAlertCircle />
                      {actionError.message}
                    </div>
                  )}
                </div>

                <div className="document-modal-actions">
                  <button
                    type="button"
                    className="document-modal-cancel"
                    onClick={closeModal}
                    disabled={!!deletingId}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="document-modal-danger"
                    onClick={handleDelete}
                    disabled={!!deletingId}
                  >
                    {deletingId ? "Deleting..." : "Delete Document"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default SessionDocuments;
