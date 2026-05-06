import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import Context from "../context";

function ClientProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
const { setGlobalData, fetchGlobalData } = useContext(Context);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showFollowUp, setShowFollowUp] = useState(false);

  const [followUpData, setFollowUpData] = useState({
    type: "Call",
    note: "",
    nextFollowUp: ""
  });

  // ================= FETCH CLIENT =================
  // Added isSilent parameter to prevent "Loading..." screen during updates
  const fetchClientdetail = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);

      const response = await fetch(
        `${SummaryApi.clientdetails.url}/${id}`,
        {
          method: SummaryApi.clientdetails.method,
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        setClient(data.data);
      } else {
        setError("Failed to load client");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchClientdetail();
  }, [id]);

  if (loading) return <div className="p-6">Loading client...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!client) return <div className="p-6">No client data found</div>;

  const interactions = client.interactions || [];
  const followUps = client.followUps || [];

  // ================= SAVE FOLLOW-UP =================
  const handleSaveFollowUp = async () => {
    try {
      const response = await fetch(SummaryApi.addFollowUp.url, {
        method: SummaryApi.addFollowUp.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          clientId: client._id,
          type: followUpData.type,
          note: followUpData.note,
          nextFollowUp: followUpData.nextFollowUp
        })
      });

     
const data = await response.json();

if (data.success) {

          
      await fetchGlobalData();
        setShowFollowUp(false);
        setFollowUpData({
          type: "Call",
          note: "",
          nextFollowUp: ""
        });

        // Use silent fetch here so the data updates instantly without UI flickering
        fetchClientdetail(true);
      }

    } catch (err) {
      console.error(err);
    }
  };

// =================Delete============================================
  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Delete this client?");

  if (!confirmDelete) return;

  try {
    const res = await fetch(
      `${SummaryApi.deleteClient.url}/${id}`,
      {
        method: SummaryApi.deleteClient.method,
        credentials: "include",
      }
    );

    const data = await res.json();

    if (data.success) {
     
      navigate("/clients");
    } else {
      alert(data.message);
    }

  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* HEADER */}
      <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">{client.name}</h1>
          <p className="text-gray-500">{client.email}</p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">

  <button
    onClick={(e) => {
      e.stopPropagation();
      navigate(`/client/${client._id}/addInteractions`);
    }}
    className="flex-1 md:flex-none bg-indigo-600 text-white px-4 py-2 rounded-lg"
  >
    Add Interaction
  </button>

  <button
    onClick={() => setShowFollowUp(true)}
    className="flex-1 md:flex-none border bg-white px-4 py-2 rounded-lg"
  >
    Next Follow-up
  </button>

  {/* ✅ DELETE BUTTON */}
  <button
    onClick={() => handleDelete(client._id)}
    className="flex-1 md:flex-none bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
  >
    Delete
  </button>

</div>
      </div>

      {/* MAIN GRID - grid-cols-1 for mobile, grid-cols-3 for desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="col-span-1 space-y-6">

          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-3 border-b pb-2">Client Info</h2>
            <div className="space-y-2">
              <p><strong>Phone:</strong> {client.phone || "N/A"}</p>
              <p><strong>Type:</strong> {client.type || "N/A"}</p>
              <p><strong>Budget:</strong> ₹ {client.budget?.toLocaleString() || "N/A"}</p>
              <p><strong>Location:</strong> {client.preferredLocation || "N/A"}</p>
              <p><strong>Property:</strong> {client.propertyType || "N/A"}</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow">
            <h2 className="font-semibold mb-3">Assigned Agent</h2>
            <p className="font-semibold text-indigo-600">
              {client.agentId?.name || "Not Assigned"}
            </p>
            <p className="text-gray-500 text-sm">
              {client.agentId?.email || ""}
            </p>
            <button className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg">
              Contact Agent
            </button>
          </div>

        </div>

        {/* RIGHT TIMELINE */}
        <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="font-semibold mb-4">Activity Timeline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* INTERACTIONS */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Interactions</h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {interactions.length > 0 ? (
                  interactions.map((item, index) => (
                    <div key={index} className="flex gap-4 items-start">
                      <div className="w-3 h-3 bg-indigo-600 rounded-full mt-2 shrink-0"></div>
                      <div>
                        <p className="font-semibold">{item.type}</p>
                        <p className="text-gray-600 text-sm">{item.note || "No notes"}</p>
                        <p className="text-gray-400 text-xs">
                          {new Date(item.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No interactions</p>
                )}
              </div>
            </div>

            {/* FOLLOW-UPS */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2">Follow-ups</h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {followUps.length > 0 ? (
                  followUps
                    .sort((a, b) => new Date(a.nextFollowUp) - new Date(b.nextFollowUp))
                    .map((item, index) => (
                      <div key={index} className="flex gap-4 items-start">
                        <div className={`w-3 h-3 rounded-full mt-2 shrink-0 ${
                          new Date(item.nextFollowUp) < new Date() ? "bg-red-500" : "bg-green-500"
                        }`}></div>
                        <div>
                          <p className="font-semibold">{item.type}</p>
                          <p className="text-gray-600 text-sm">{item.note}</p>
                          <p className={`text-xs ${
                            new Date(item.nextFollowUp) < new Date() ? "text-red-500" : "text-green-600"
                          }`}>
                            Next: {new Date(item.nextFollowUp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-gray-400 text-sm">No follow-ups</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROPERTY HISTORY */}
      <div className="mt-6 bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-4">Visited Properties</h2>
        {client.history?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {client.history.map((item, index) => {
              const prop = item.propertyId;
              if (!prop) return null;
              return (
                <div
                  key={index}
                  onClick={() => navigate(`/propertydetail/${prop._id}`)}
                  className="cursor-pointer bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  <img src={prop.images?.[0]?.url} alt={prop.title} className="w-full h-[150px] object-cover" />
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate">{prop.title}</h3>
                    <p className="text-xs text-gray-500 truncate">{prop.location}</p>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded inline-block mt-2">
                      {item.type}
                    </span>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400">No visited properties</p>
        )}
      </div>

      {/* MODAL */}
      {showFollowUp && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-[400px] shadow-2xl">
            <h2 className="font-semibold mb-3">Add Follow-up</h2>
            <select
              value={followUpData.type}
              onChange={(e) => setFollowUpData({ ...followUpData, type: e.target.value })}
              className="w-full border rounded p-2 mb-3 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Call">Call</option>
              <option value="Meeting">Meeting</option>
              <option value="Visit">Visit</option>
              <option value="Email">Email</option>
            </select>
            <input
              type="datetime-local"
              className="w-full border rounded p-2 mb-3 outline-none focus:ring-2 focus:ring-indigo-500"
              value={followUpData.nextFollowUp}
              onChange={(e) => setFollowUpData({ ...followUpData, nextFollowUp: e.target.value })}
            />
            <textarea
              placeholder="Write notes..."
              className="w-full border rounded p-2 mb-3 outline-none focus:ring-2 focus:ring-indigo-500"
              value={followUpData.note}
              onChange={(e) => setFollowUpData({ ...followUpData, note: e.target.value })}
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowFollowUp(false)} className="text-gray-500 font-medium">Cancel</button>
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded font-medium"
                onClick={handleSaveFollowUp}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default ClientProfile;