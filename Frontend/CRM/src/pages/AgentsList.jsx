import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";

function AgentList() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ================= FETCH AGENTS =================
  const fetchAgents = async () => {
    try {
      setLoading(true);

      const res = await fetch(SummaryApi.agent.url, {
        credentials: "include"
      });

      const data = await res.json();

      if (data.success) {
        setAgents(data.data || []);
      } else {
        setAgents([]);
      }
    } catch (err) {
      console.error("Agent fetch error:", err);
      setAgents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading agents...
      </div>
    );
  }

  // ================= EMPTY =================
  if (!agents.length) {
    return (
      <div className="p-6 text-center text-gray-400">
        No agents found
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Agents</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {agents.map(agent => (
          <div
            key={agent._id}
            onClick={() => navigate(`/agent/${agent._id}`)}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
          >
            {/* AGENT INFO */}
            <h2 className="font-semibold text-lg">{agent.name}</h2>
            <p className="text-sm text-gray-500">{agent.email}</p>

            {/* EXTRA INFO (optional) */}
            {agent.phone && (
              <p className="text-xs text-gray-400 mt-1">{agent.phone}</p>
            )}

            {/* STATS FROM BACKEND */}
            <div className="mt-4 text-sm">
              <p>Total Deals: {agent.totalDeals || 0}</p>

              <p className="text-green-600 font-bold">
                Revenue: ₹ {(agent.totalRevenue || 0).toLocaleString()}
              </p>

              <p className="text-xs text-gray-400">
                Closed: {agent.closedDeals || 0}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default React.memo(AgentList);