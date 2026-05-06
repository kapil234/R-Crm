import { useState, useEffect, useContext } from "react";
import SummaryApi from "../common";
import Context from "../context";
import { useNavigate } from "react-router-dom";

function Leads() {
  const [search, setSearch] = useState("");
  const [activeAction, setActiveAction] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const navigate = useNavigate();

  const steps = ["New", "Contacted", "Qualified", "Closed", "Lost"];

  const { leads, setGlobalData, fetchGlobalData } = useContext(Context);

  // ---------------- DELETE LEAD ----------------
  const handleDeleteLead = async (id) => {
    const confirmDelete = window.confirm("Delete this lead?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${SummaryApi.deleteLead.url}/${id}`, {
        method: SummaryApi.deleteLead.method,
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setGlobalData((prev) => ({
          ...prev,
          leads: prev.leads.filter((l) => l._id !== id),
        }));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ---------------- UPDATE STATUS ----------------
  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${SummaryApi.updateLeadStatus.url}/${id}`, {
        method: SummaryApi.updateLeadStatus.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (data.success) {
        await fetchGlobalData();
        // setGlobalData((prev) => ({
        //   ...prev,
        //   leads: prev.leads.map((l) =>
        //     l._id === id ? { ...l, status } : l
        //   ),
        //   deals:
        //     status === "Qualified" && data.deal
        //       ? [...prev.deals, data.deal]
        //       : prev.deals,
        // }));
      } else {
        console.error("Update failed:", data.message);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const getIndex = (status) => steps.indexOf(status);

  const visibleSteps = (status) => {
    if (status === "Lost") {
      return ["New", "Contacted", "Qualified", "Lost"];
    }
    return ["New", "Contacted", "Qualified", "Closed"];
  };

  const filtered = leads.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Leads</h2>

        <button
          onClick={() => navigate("/lead/add")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          + Add Lead
        </button>
      </div>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search leads..."
        className="w-full p-3 mb-6 rounded-xl border bg-white"
      />

      {/* CARDS */}
      <div className="space-y-4">

        {filtered.map((lead) => {
          const currentIndex = getIndex(lead.status);

          return (
            <div
              key={lead._id}
              className="relative bg-white rounded-xl shadow-sm p-5 pr-10 flex flex-col md:grid md:grid-cols-12 gap-4"
            >

              {/* 🔥 CLEAN MENU (REPLACED DELETE BUTTON) */}
              <div className="absolute top-3 right-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu(openMenu === lead._id ? null : lead._id);
                  }}
                  className="text-gray-500 hover:text-black text-lg px-2"
                >
                  ⋮
                </button>

                {openMenu === lead._id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLead(lead._id);
                        setOpenMenu(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              {/* LEFT */}
              <div className="col-span-3">
                <h3 className="font-semibold">{lead.name}</h3>
                <p className="text-sm text-gray-500">{lead.email}</p>
                <p className="text-xs text-gray-400">{lead.phone}</p>
              </div>

              {/* MIDDLE */}
              <div className="col-span-4 text-sm space-y-1">
                <p>💰 Budget: ₹{lead.budget?.toLocaleString()}</p>
                <p>📍 Preference: {lead.preferredLocation}</p>
                <p>🏠 Type: {lead.propertyType}</p>
                <p>👤 Agent: {lead.assignedTo?.name || "Unassigned"}</p>
              </div>

              {/* RIGHT */}
              <div className="col-span-5 flex flex-col justify-between">

                {/* PIPELINE */}
                <div className="flex items-center justify-between mb-3 w-full overflow-hidden">

                  {visibleSteps(lead.status).map((step, i) => (
                    <div key={step} className="flex items-center flex-1 last:flex-none">

                      <div
                        className={`px-2 py-1 text-[9px] md:text-[10px] rounded-full whitespace-nowrap ${
                          lead.status === "Lost" && (step === "Qualified" || step === "Lost")
                            ? "bg-red-100 text-red-600"
                            : lead.status === "Closed" && step === "Closed"
                            ? "bg-green-100 text-green-700"
                            : i < currentIndex
                            ? "bg-green-100 text-green-600"
                            : i === currentIndex
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {step}
                      </div>

                      {i !== visibleSteps(lead.status).length - 1 && (
                        <div
                          className={`flex-1 h-[2px] mx-1 min-w-0 ${
                            i < currentIndex ? "bg-indigo-500" : "bg-gray-200"
                          }`}
                        />
                      )}

                    </div>
                  ))}

                </div>

                {/* ACTIONS */}
                {lead.status === "New" && (
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-xs text-gray-500">Next Step</p>

                    <button
                      onClick={() => setActiveAction(lead._id)}
                      className="bg-indigo-600 text-white text-xs px-3 py-1 rounded"
                    >
                      Contact Lead
                    </button>
                  </div>
                )}

                {activeAction === lead._id && lead.status === "New" && (
                  <div className="flex gap-2 mt-2">

                    <button
                      onClick={() => {
                        window.open(`tel:${lead.phone}`);
                        updateStatus(lead._id, "Contacted");
                        setActiveAction(null);
                      }}
                      className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded"
                    >
                      Call
                    </button>

                    <button
                      onClick={() => {
                        window.open(`mailto:${lead.email}`);
                        updateStatus(lead._id, "Contacted");
                        setActiveAction(null);
                      }}
                      className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded"
                    >
                      Email
                    </button>

                  </div>
                )}

                {lead.status === "Contacted" && (
                  <div className="flex items-center justify-between mt-2">

                    <p className="text-xs text-gray-500">Next Step</p>

                    <div className="flex gap-2">

                      <button
                        onClick={() => updateStatus(lead._id, "Qualified")}
                        className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded"
                      >
                        Qualified
                      </button>

                      <button
                        onClick={() => updateStatus(lead._id, "Lost")}
                        className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded"
                      >
                        Not Qualified
                      </button>

                    </div>
                  </div>
                )}

                {lead.status === "Qualified" && (
                  <div className="flex items-center justify-between mt-2">

                    <p className="text-xs text-gray-500">Next Step</p>

                    <button
                      onClick={() => updateStatus(lead._id, "Closed")}
                      className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded"
                    >
                      Close Lead
                    </button>

                  </div>
                )}

              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
}

export default Leads;

 