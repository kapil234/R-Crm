import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";

function AddClient() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    type: "Buyer",
    budget: "",
    preferredLocation: "",
    propertyType: "apartment"
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(SummaryApi.addClient.url, {
        method: SummaryApi.addClient.method,
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (data.success) {
        alert("Client Added Successfully");
        navigate("/clients");
      } else {
        alert(data.message);
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-[500px]"
      >

        <h2 className="text-xl font-bold mb-4">Add Client</h2>

        {/* NAME */}
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-3"
        />

        {/* PHONE */}
        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          required
          className="w-full p-2 border rounded mb-3"
        />

        {/* EMAIL */}
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        {/* TYPE */}
        <select
          name="type"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        >
          <option value="Buyer">Buyer</option>
          <option value="Seller">Seller</option>
        </select>

        {/* BUDGET */}
        <input
          name="budget"
          placeholder="Budget"
          type="number"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        {/* LOCATION */}
        <input
          name="preferredLocation"
          placeholder="Preferred Location"
          onChange={handleChange}
          className="w-full p-2 border rounded mb-3"
        />

        {/* PROPERTY TYPE */}
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

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
        >
          Save Client
        </button>

      </form>
    </div>
  );
}

export default AddClient;