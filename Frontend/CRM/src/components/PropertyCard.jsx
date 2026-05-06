import React, { useContext } from "react";
import { Link } from "react-router-dom";
import SummaryApi from "../common";
import Context from "../context";

function PropertyCard({ property }) {
  const { userDetails } = useContext(Context);

  const canEdit =
    userDetails?.role === "Admin" || userDetails?.role === "Agent";

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">

      {/* Image */}
      <div className="relative">
        <img
          src={property.images?.[0]?.url || "https://via.placeholder.com/300"}
          alt="property"
          className="h-48 w-full object-cover"
          referrerPolicy="no-referrer"
        />

        {/* Status Badge */}
        <span className={`absolute top-3 left-3 px-3 py-1 text-xs rounded-full 
          ${property.status === "Available" ? "bg-green-500" : "bg-red-500"} text-white`}>
          {property.status}
        </span>

        {/* Price Tag */}
        <div className="absolute bottom-3 right-3 bg-indigo-600 text-white px-3 py-1 rounded">
          ₹{property.price}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{property.title}</h3>
        <p className="text-gray-500 text-sm">{property.location}</p>

        {/* Details */}
        <div className="flex justify-between text-sm mt-3 text-gray-600">
          <span>📏 {property.size} sqft</span>
          <span>🏠 {property.type}</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">

          {/* VIEW BUTTON */}
       <Link to={`/propertydetail/${property._id}`} className="flex-1">
    <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium shadow hover:bg-indigo-700 transition duration-200">
      View
    </button>
  </Link>

  {/* EDIT BUTTON */}
  {canEdit && (
    <Link to={`/property/edit/${property._id}`} className="flex-1">
      <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-100 transition duration-200">
        Edit
      </button>
    </Link>
          )}

        </div>
      </div>
    </div>
  );
}


export default PropertyCard;