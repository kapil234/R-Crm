import React, { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import Context from "../context";
function AddLead() {
  const navigate = useNavigate();
const { leads, setGlobalData ,fetchGlobalData} = useContext(Context)
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    source: "manual",
    budget: "",
    preferredLocation: "",
    propertyType: "apartment",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(SummaryApi.addLead.url, {
        method: SummaryApi.addLead.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
       if (data.success) {

           await fetchGlobalData();

  navigate("/leads");
}
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-[500px]"
      >
        <h2 className="text-xl font-bold mb-4">Add Lead</h2>

        <input
          name="name"
          placeholder="Name"
          required
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        <input
          name="phone"
          placeholder="Phone"
          required
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        <select
          name="source"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="manual">Manual</option>
          <option value="website">Website</option>
          <option value="ads">Ads</option>
          <option value="call">Call</option>
          <option value="referral">Referral</option>
        </select>

        <input
          name="budget"
          type="number"
          placeholder="Budget"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        <input
          name="preferredLocation"
          placeholder="Preferred Location"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        <select
          name="propertyType"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
        </select>

        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">
          Save Lead
        </button>
      </form>
    </div>
  );
}

export default AddLead;