import React, { useEffect, useState, useContext } from "react";
import PropertyCard from "../components/PropertyCard";
import Context from "../context";
import SummaryApi from "../common";
import { useNavigate } from "react-router-dom";


function Properties() {
  const { userDetails } = useContext(Context);
const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(false);

  const canAddProperty =
    userDetails?.role === "Admin" || userDetails?.role === "Agent";

  // ================= FETCH =================
  const fetchProperties = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (search.trim()) params.append("search", search);
      if (sort) params.append("sort", sort);

      const url = params.toString()
        ? `${SummaryApi.allProperties.url}?${params.toString()}`
        : SummaryApi.allProperties.url;

      const res = await fetch(url, {
        method: SummaryApi.allProperties.method,
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setProperties(data.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ================= LOAD ALL =================
  useEffect(() => {
    fetchProperties();
  }, []);

  // ================= ENTER KEY SEARCH =================
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchProperties();
    }
  };

  // ================= SORT CHANGE =================
  const handleSortChange = (value) => {
    setSort(value);
    fetchProperties();
  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            🏠 Properties
          </h2>
          <p className="text-sm text-gray-500">
            Browse and manage all available properties
          </p>
        </div>

        {canAddProperty && (
          <button  onClick={() => navigate("/addproperties")}  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow">
            + Add Property
          </button>
        )}

      </div>

      {/* FILTER CARD */}
      <div className="bg-white p-4 rounded-2xl shadow mb-6 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by name or location..."
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* SORT */}
        <select
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none"
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="">Sort by Price</option>
          <option value="asc">⬆ Low → High</option>
          <option value="desc">⬇ High → Low</option>
        </select>

        {/* EMPTY SPACE */}
        <div className="hidden md:block"></div>

        {/* COUNT (RIGHT SIDE) */}
        <div className="flex justify-start md:justify-end">
          <div className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold">
            {properties.length === 0
              ? "No Properties"
              : `${properties.length} Properties`}
          </div>
        </div>

      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-10 text-gray-500">
          Loading properties...
        </div>
      )}

      {/* GRID */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {properties.length > 0 ? (
            properties.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No properties found
            </div>
          )}

        </div>
      )}

    </div>
  );
}


export default Properties;