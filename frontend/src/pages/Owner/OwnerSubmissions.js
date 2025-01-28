import React, { useState, useEffect } from "react";
import axios from "axios";

const OwnerSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get("http://localhost:8000/ownersubmissions/");
        setSubmissions(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch submissions");
        setLoading(false);
        console.error("Error:", err);
      }
    };

    fetchSubmissions();
  }, []);

  const handleRedirect = (status) => {
    if (status === "accepted") {
      window.location.href = "/ownermenu";
    } else {
      window.location.href = "/owneradd";
    }
  };

  const handleReject = async (submissionId) => {
    try {
      await axios.post(`http://localhost:8000/ownersubmissions/reject/${submissionId}`);
      setSubmissions((prevSubmissions) =>
        prevSubmissions.map((submission) =>
          submission._id === submissionId ? { ...submission, status: "rejected" } : submission
        )
      );
    } catch (err) {
      console.error("Failed to reject submission:", err);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "20px", fontSize: "18px" }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        Your Submissions
      </h1>
      {submissions.length === 0 ? (
        <div style={{ textAlign: "center", color: "gray" }}>No submissions found</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
            <thead>
              <tr style={{ backgroundColor: "#f9f9f9" }}>
                {["Hotel Name", "Owner", "Contact", "Email", "Address", "Food Menu", "Status", "Actions"].map((header) => (
                  <th
                    key={header}
                    style={{
                      padding: "10px",
                      borderBottom: "2px solid #ddd",
                      textAlign: "left",
                      fontSize: "14px",
                      fontWeight: "bold",
                      color: "#555",
                      textTransform: "uppercase",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id} style={{ backgroundColor: "#fff", transition: "background-color 0.2s" }}>
                  <td style={cellStyle}>{submission.hotel_name}</td>
                  <td style={cellStyle}>{submission.owner_name}</td>
                  <td style={cellStyle}>{submission.hotel_number}</td>
                  <td style={cellStyle}>{submission.hotel_email}</td>
                  <td style={cellStyle}>{submission.hotel_address}</td>
                  <td style={cellStyle}>{submission.food_menu}</td>
                  <td style={{ ...cellStyle, textAlign: "center" }}>
                    <span
                      style={{
                        padding: "5px 10px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: 
                          submission.status === "accepted"
                            ? "#2f855a"
                            : submission.status === "rejected"
                            ? "#e53e3e"
                            : "#d69e2e",
                        backgroundColor: 
                          submission.status === "accepted"
                            ? "#f0fff4"
                            : submission.status === "rejected"
                            ? "#fff5f5"
                            : "#fefcbf",
                      }}
                    >
                      {submission.status === "in_review" ? "In Review" : submission.status === "accepted" ? "Accepted" : "Rejected"}
                    </span>
                  </td>
                  <td style={{ ...cellStyle, textAlign: "center" }}>
                    {submission.status === "accepted" ? (
                      <button
                        onClick={() => handleRedirect("accepted")}
                        style={buttonStyle("#2f855a", "#f0fff4")}
                      >
                        Go to menu
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleRedirect(submission.status)}
                          style={buttonStyle("#d69e2e", "#fefcbf")}
                        >
                          Resubmit
                        </button>
                        <button
                          onClick={() => handleReject(submission._id)}
                          style={buttonStyle("#e53e3e", "#fff5f5")}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const cellStyle = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  fontSize: "14px",
  color: "#333",
};

const buttonStyle = (color, backgroundColor) => ({
  padding: "8px 12px",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "bold",
  color,
  backgroundColor,
  border: "none",
  cursor: "pointer",
  marginLeft: "5px",
});

export default OwnerSubmissions;
