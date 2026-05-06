import React, { useState, useEffect,useContext } from "react";
import { useParams } from "react-router-dom";
import SummaryApi from "../common";
import Context from "../context";

function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [showForm, setShowForm] = useState(false);
const { setGlobalData,fetchGlobalData } = useContext(Context);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    budget: "",
    preferredLocation: ""
  });

  const fetchProperty = async () => {
    try {
      const response = await fetch(
        `${SummaryApi.propertydetail.url}/${id}`,
        {
          method: SummaryApi.propertydetail.method,
          credentials: "include"
        }
      );
      const data = await response.json();
      if (data.success) {
        setProperty(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${SummaryApi.leadcreate.url}/${id}`, {
        method: SummaryApi.leadcreate.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        await fetchGlobalData(); 
     
        alert("Lead Created ✅");
        setShowForm(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!property) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* 
          CHANGES: 
          1. Changed grid-cols-3 to grid-cols-1 (mobile) and md:grid-cols-3 (desktop)
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT COLUMN */}
        <div className="col-span-1 md:col-span-2 space-y-6">

          {/* IMAGE + INFO */}
          <div className="bg-white p-4 md:p-6 rounded-xl shadow">
            <img
              src={property.images?.[0]?.url}
              alt={property.title}
              className="w-full h-[250px] md:h-[400px] object-cover rounded-lg mb-4"
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h1 className="text-xl md:text-2xl font-bold">{property.title}</h1>
              <button
                onClick={() => setShowForm(true)}
                className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                I'm Interested
              </button>
            </div>

            <p className="text-green-600 text-xl font-semibold mt-2">
              ₹ {property.price?.toLocaleString()}
            </p>
            <p className="text-gray-500 mt-1">{property.location}</p>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold text-lg mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed">{property.description}</p>
          </div>

          {/* AMENITIES */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-semibold text-lg mb-3">Amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {property.amenities?.map((item, i) => (
                <div key={i} className="bg-gray-100 px-3 py-2 rounded text-sm flex items-center">
                  <span className="text-green-500 mr-2">✔</span> {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (MAP) */}
        {/* h-[300px] on mobile looks better than full 500px */}
        <div className="bg-white p-2 md:p-4 rounded-xl shadow h-[300px] md:h-[500px] sticky top-6">
          <iframe
            title="map"
            width="100%"
            height="100%"
            className="rounded-lg"
            style={{ border: 0 }}
            loading="lazy"
            src={`https://www.google.com/maps?q=${encodeURIComponent(property.location)}&output=embed`}
          ></iframe>
        </div>

      </div>

      {/* MODAL - RESPONSIVE WIDTH */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-[420px] p-6 rounded-xl shadow-lg relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-6 text-center">Create Lead</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Budget (₹)"
                  className="w-1/2 border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <input
                  type="text"
                  name="preferredLocation"
                  value={formData.preferredLocation}
                  onChange={handleChange}
                  placeholder="Location"
                  className="w-1/2 border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md"
              >
                Submit Interest
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyDetails;