import React, { useState, useContext, useEffect } from "react";
import Context from "../context";
import uploadImage from "./uploadImages";
import { useParams, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
function AddProperty() {

  const { userDetails } = useContext(Context);
  const { id } = useParams(); // ✅ detect edit
  const navigate = useNavigate();

  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    location: "",
    price: "",
    size: "",
    amenities: "",
    images: [],
    status: "Available",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  // ================= FETCH (EDIT MODE) =================
  useEffect(() => {
    if (!isEdit) return;

    const fetchProperty = async () => {
      try {
        const res = await fetch(`${SummaryApi.propertydetail.url}/${id}`, {
          credentials: "include",
        });

        const data = await res.json();

        if (data.success) {
          const p = data.data;

          setFormData({
            title: p.title || "",
            type: p.type || "",
            location: p.location || "",
            price: p.price || "",
            size: p.size || "",
            amenities: p.amenities?.join(", ") || "",
            images: p.images || [],
            status: p.status || "Available",
            description: p.description || "",
          });
        }

      } catch (err) {
        console.error(err);
      }
    };

    fetchProperty();
  }, [id, isEdit]);

  // ================= IMAGE UPLOAD =================
  const uploadFiles = async (files) => {
    try {
      setLoading(true);

      const uploaded = [];

      for (let file of files) {
        const img = await uploadImage(file);
        uploaded.push(img);
      }

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploaded],
      }));

    } catch (err) {
      console.error(err);
      alert("Image upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    uploadFiles(Array.from(e.target.files));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    uploadFiles(Array.from(e.dataTransfer.files));
  };

  const handleRemoveImage = (public_id) => {
    const updated = formData.images.filter(
      (img) => img.public_id !== public_id
    );

    setFormData((prev) => ({
      ...prev,
      images: updated,
    }));
  };

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        title: formData.title,
        type: formData.type,
        location: formData.location,
        price: Number(formData.price),
        size: Number(formData.size),
        amenities: formData.amenities
          ? formData.amenities.split(",").map(a => a.trim())
          : [],
        images: formData.images,
        status: formData.status,
        description: formData.description,
      };

      const url = isEdit
        ? `${SummaryApi.updateProperty.url}/${id}`
        : SummaryApi.addProperty.url;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        alert(isEdit ? "Updated ✅" : "Added ✅");

        navigate("/properties"); 
      }

    } catch (err) {
      console.error("Submit Error:", err);
      alert("Server Error ❌");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const handleDelete = async () => {
    if (!window.confirm("Delete this property?")) return;

    try {
      const res = await fetch(
        `${SummaryApi.deleteProperty.url}${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("Deleted ✅");
        navigate("/properties");
      }

    } catch (err) {
      console.error(err);
    }
  };

  const isBlocked = userDetails?.role === "User";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      {isBlocked ? (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h2 className="text-xl font-bold text-red-500">
            Access Denied 🚫
          </h2>
          <p className="text-gray-500 mt-2">
            Only Admin & Agent can add properties
          </p>
        </div>
      ) : (

        <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-6 md:p-8">

          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
            {isEdit ? "Edit Property" : "Add Property"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-4">

            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Property Title"
              className="input"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select Type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
              </select>

              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="input"
                required
              />

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price"
                className="input"
                required
              />

              <input
                type="number"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="Size"
                className="input"
              />

            </div>

            <input
              name="amenities"
              value={formData.amenities}
              onChange={handleChange}
              placeholder="Amenities"
              className="input"
            />

            {/* IMAGE UPLOAD */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 p-6 rounded-xl text-center"
            >
              <p className="text-gray-500">Drag & Drop Images or Click</p>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="fileUpload"
              />

              <label htmlFor="fileUpload" className="text-green-600 cursor-pointer">
                Browse Files
              </label>
            </div>

            {/* PREVIEW */}
            <div className="grid grid-cols-3 gap-3">
              {formData.images.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img.url}
                    className="h-24 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img.public_id)}
                    className="absolute top-1 right-1 bg-red-500 text-white px-2 rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input"
            >
              <option value="Available">Available</option>
              <option value="Sold">Sold</option>
            </select>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input min-h-[120px]"
              placeholder="Description"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold"
            >
              {loading ? "Processing..." : isEdit ? "Update Property" : "Add Property"}
            </button>

            {/* ✅ DELETE BUTTON (ONLY IN EDIT) */}
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold"
              >
                Delete Property
              </button>
            )}

          </form>
        </div>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 10px;
          background: #fafafa;
          outline: none;
        }
        .input:focus {
          border-color: #22c55e;
          background: #fff;
        }
      `}</style>

    </div>
  );
}





export default AddProperty;