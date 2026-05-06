import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SummaryApi from "../common";

function AgentDetails() {
  const { id } = useParams();

  const [data, setData] = useState(null);

  const fetchDetails = async () => {
    try {
      const res = await fetch(
        `${SummaryApi.agent.url}/${id}`,
        { credentials: "include" }
      );

      const result = await res.json();

      if (result.success) {
        setData(result.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  if (!data) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      
      {/* ================= HEADER ================= */}
<div className="bg-white p-5 rounded-xl shadow mb-6">

 
  <h1 className="text-xl md:text-2xl font-bold">
    {data.agent?.name || "Agent"}
  </h1>


  <div className="text-sm text-gray-500 mt-1">
    {data.agent?.email && <p>{data.agent.email}</p>}
    {data.agent?.phone && <p>{data.agent.phone}</p>}
  </div>


  <div className="flex flex-wrap gap-4 mt-3 text-sm">
    <span className="bg-gray-100 px-3 py-1 rounded">
      Deals: {data.totalDeals}
    </span>

    <span className="bg-green-100 text-green-700 px-3 py-1 rounded">
      Revenue: ₹ {data.revenue?.toLocaleString()}
    </span>
  </div>

</div>

      {/* ================= DEALS ================= */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-3">Deals</h2>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {data.deals.length === 0 && (
            <p className="text-gray-400 text-sm">No deals found</p>
          )}

          {data.deals.map((d) => (
            <div
              key={d._id}
              className="border p-3 rounded-lg hover:bg-gray-50 transition"
            >
              <p className="font-medium">
                {d.propertyId?.title || "No Property"}
              </p>

              <p className="text-sm text-gray-500">
                {d.propertyId?.location || "No Location"}
              </p>

              <p className="text-indigo-600 font-semibold">
                ₹ {d.price?.toLocaleString()}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Stage: {d.stage}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= LEADS ================= */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="font-semibold mb-3">Leads</h2>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
          {data.leads.length === 0 && (
            <p className="text-gray-400 text-sm">No leads found</p>
          )}

          {data.leads.map((l) => (
            <div
              key={l._id}
              className="border p-3 rounded-lg hover:bg-gray-50 transition"
            >
              <p className="font-medium">{l.name}</p>

              <p className="text-sm text-gray-500">{l.phone}</p>

              <p className="text-xs text-gray-400 mt-1">
                Status: {l.status}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================= ACTIVITY ================= */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Recent Activity</h2>

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          {data.activities.length === 0 && (
            <p className="text-gray-400 text-sm">No activity found</p>
          )}

          {data.activities.map((a) => (
            <div key={a._id} className="border-b pb-2">
              <p className="text-sm text-gray-700">
                {a.message}
              </p>

              <p className="text-xs text-gray-400">
                {new Date(a.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default AgentDetails;