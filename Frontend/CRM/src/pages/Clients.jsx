import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";

function ClientList() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [clients, setClients] = useState([]);

  const fetchAllclients = async () => {
    try {
      const fetchData = await fetch(SummaryApi.allClients.url, {
        method: SummaryApi.allClients.method,
        credentials: "include",
      });

      const dataResponse = await fetchData.json();

      if (dataResponse.success) {
        setClients(dataResponse.data);
      } else {
        console.log(dataResponse.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllclients();
  }, []);

  const filteredClients = clients
    .filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((c) => (filter === "All" ? true : c.type === filter));

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* HEADER */}
      <div className="bg-white p-4 md:p-5 rounded-xl shadow flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Clients</h1>
          <p className="text-gray-500 text-sm">Manage all your clients</p>
        </div>

        <button
          onClick={() => navigate("/client/add")}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 w-full md:w-auto"
        >
          + Add Client
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-[300px] p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded-lg w-full md:w-auto"
        >
          <option value="All">All</option>
          <option value="Buyer">Buyer</option>
          <option value="Seller">Seller</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full table-fixed min-w-[650px]">

          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4 text-left w-[30%]">Client</th>
              <th className="text-center w-[20%]">Contact</th>
              <th className="text-center w-[15%]">Type</th>
              <th className="text-center w-[20%]">Preferred Location</th>

              {/* ❌ Hidden on mobile */}
              <th className="text-center w-[10%] hidden md:table-cell">
                Budget
              </th>

              <th className="text-center w-[5%]"></th>
            </tr>
          </thead>

          <tbody>
            {filteredClients.map((client) => (
              <tr
                key={client._id}
                className="border-t hover:bg-gray-50 transition cursor-pointer"
                onClick={() => navigate(`/client/${client._id}`)}
              >

                {/* NAME */}
                <td className="p-4 text-left">
                  <p className="font-semibold">{client.name}</p>

                  <p className="text-xs text-gray-400 truncate">
                    {client.email}
                  </p>

                  {/* ✅ Show budget in mobile only */}
                  <p className="text-xs text-indigo-500 md:hidden">
                    ₹ {client?.budget?.toLocaleString() || 0}
                  </p>
                </td>

                {/* PHONE */}
                <td className="text-center max-w-[150px] truncate">
                  {client.phone}
                </td>

                {/* TYPE */}
                <td className="text-center">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      client.type === "Buyer"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {client.type}
                  </span>
                </td>

                {/* LOCATION */}
                <td className="text-center text-gray-500 truncate">
                  {client.preferredLocation}
                </td>

                {/* ❌ Hidden on mobile */}
                <td className="text-center font-semibold text-indigo-600 hidden md:table-cell">
                  ₹ {client?.budget?.toLocaleString() || 0}
                </td>

                {/* ACTION */}
                <td className="text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/client/${client._id}`);
                    }}
                    className="text-indigo-600 hover:underline text-sm"
                  >
                    View
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default ClientList;