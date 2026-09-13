import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  FiFileText,
  FiExternalLink,
  FiDownload,
  FiAlertCircle,
  FiUploadCloud,
  FiCheckCircle,
  FiTrash2,
} from "react-icons/fi";
import "./SessionDocuments.css";

function SessionDocuments({ sessionId, isTeacher }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [uploadMessage, setUploadMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  const fileInputRef = useRef(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const res = await axios.get(`/api/documents/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDocuments(res.data);
    } catch (err) {
      console.error("Failed to fetch documents:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load class materials"
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

  const getFileUrl = (fileUrl) => {
    if (!fileUrl) return "#";

    if (fileUrl.startsWith("http")) {
      return fileUrl;
    }

    return `http://localhost:5000${fileUrl}`;
  };

  const handleOpen = (fileUrl) => {
    const url = getFileUrl(fileUrl);

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(getFileUrl(fileUrl), {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blobUrl = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      link.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download document");
    }
  };

  const handleDelete = async (documentId, fileName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${fileName}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(documentId);
      setError("");
      setDeleteMessage("");

      const token = localStorage.getItem("token");

      await axios.delete(`/api/documents/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDeleteMessage("Document deleted successfully");

      await fetchDocuments();

      setTimeout(() => {
        setDeleteMessage("");
      }, 3000);
    } catch (err) {
      console.error("Delete failed:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete document"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setError("");
      setUploadMessage("");
      setDeleteMessage("");

      const token = localStorage.getItem("token");

      const formData = new FormData();

      formData.append("sessionId", sessionId);
      formData.append("file", file);

      await axios.post("/api/documents", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUploadMessage("Document uploaded successfully");

      await fetchDocuments();

      setTimeout(() => {
        setUploadMessage("");
      }, 3000);
    } catch (err) {
      console.error("Upload failed:", err);

      setError(
        err.response?.data?.message ||
          "Failed to upload document"
      );
    } finally {
      setUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <section className="session-documents-card">
      <div className="session-documents-header">
        <div className="session-documents-title-area">
          <div className="session-documents-icon">
            <FiFileText />
          </div>

          <div>
            <h3>Class Materials</h3>

            <p>
              Documents and notes shared for this session
            </p>
          </div>
        </div>

        <div className="documents-header-actions">
          {!loading && documents.length > 0 && (
            <span className="documents-count">
              {documents.length}{" "}
              {documents.length === 1
                ? "Document"
                : "Documents"}
            </span>
          )}

          {isTeacher && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                className="document-file-input"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
              />

              <button
                type="button"
                className="upload-material-btn"
                onClick={handleUploadClick}
                disabled={uploading}
              >
                <FiUploadCloud />

                <span>
                  {uploading
                    ? "Uploading..."
                    : "Upload Material"}
                </span>
              </button>
            </>
          )}
        </div>
      </div>

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

      <div className="session-documents-content">
        {loading && (
          <div className="documents-loading">
            <div className="documents-spinner"></div>

            <span>
              Loading class materials...
            </span>
          </div>
        )}

        {!loading && error && (
          <div className="documents-error">
            <FiAlertCircle />

            <span>{error}</span>
          </div>
        )}

        {!loading &&
          !error &&
          documents.length === 0 && (
            <div className="documents-empty">
              <div className="documents-empty-icon">
                <FiFileText />
              </div>

              <h4>No class materials yet</h4>

              <p>
                Documents and notes shared for this
                session will appear here.
              </p>

              {isTeacher && (
                <button
                  type="button"
                  className="empty-upload-btn"
                  onClick={handleUploadClick}
                >
                  <FiUploadCloud />
                  Upload your first material
                </button>
              )}
            </div>
          )}

        {!loading &&
          !error &&
          documents.length > 0 && (
            <div className="documents-list">
              {documents.map((doc) => (
                <div
                  className="document-item"
                  key={doc._id}
                >
                  <div className="document-main">
                    <div className="document-file-icon">
                      <FiFileText />
                    </div>

                    <div className="document-info">
                      <h4 title={doc.fileName}>
                        {doc.fileName}
                      </h4>

                      <span>
                        Added{" "}
                        {new Date(
                          doc.createdAt
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="document-actions">
                    <button
                      type="button"
                      className="document-action-btn"
                      onClick={() =>
                        handleOpen(doc.fileUrl)
                      }
                      title="Open document"
                      disabled={deletingId === doc._id}
                    >
                      <FiExternalLink />
                      <span>Open</span>
                    </button>

                    <button
                      type="button"
                      className="document-action-btn"
                      onClick={() =>
                        handleDownload(
                          doc.fileUrl,
                          doc.fileName
                        )
                      }
                      title="Download document"
                      disabled={deletingId === doc._id}
                    >
                      <FiDownload />
                      <span>Download</span>
                    </button>

                    {isTeacher && (
                      <button
                        type="button"
                        className="document-action-btn document-delete-btn"
                        onClick={() =>
                          handleDelete(
                            doc._id,
                            doc.fileName
                          )
                        }
                        title="Delete document"
                        disabled={deletingId === doc._id}
                      >
                        <FiTrash2 />

                        <span>
                          {deletingId === doc._id
                            ? "Deleting..."
                            : "Delete"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>
    </section>
  );
}

export default SessionDocuments;