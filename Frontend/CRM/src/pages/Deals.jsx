import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import Context from "../context";
import { useContext } from "react";

const stages = ["Inquiry", "Negotiation", "Agreement", "Closed"];

const stageColors = {
  Inquiry: "bg-blue-100 border-blue-400",
  Negotiation: "bg-yellow-100 border-yellow-400",
  Agreement: "bg-purple-100 border-purple-400",
  Closed: "bg-green-100 border-green-400"
};

function DealsBoard() {
const {deals,setGlobalData,fetchGlobalData}= useContext(Context);
  const navigate = useNavigate();
  const isDragging = useRef(false);

  // ================= FETCH =================
  

  // ================= DRAG =================
  const handleDragStart = (e, deal) => {
    isDragging.current = true;
    e.dataTransfer.setData("deal", JSON.stringify(deal));
  };

  const handleDrop = async (e, toStage) => {
    e.preventDefault();

    const deal = JSON.parse(e.dataTransfer.getData("deal"));
    if (deal.stage === toStage) return;

    try {
      await fetch(`${SummaryApi.updateDealstage.url}/${deal._id}`, {
        method: SummaryApi.updateDealstage.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: toStage })
      });
      await fetchGlobalData();

     

    } catch (err) {
      console.log(err);
    }

    setTimeout(() => {
      isDragging.current = false;
    }, 100);
  };

  // ================= CLICK =================
  const handleClick = (id) => {
    if (isDragging.current) return;
    navigate(`/deal/${id}`);
  };

  // ================= COMMISSION =================
  const calculateCommission = (value) => {
    return Math.floor((value || 0) * 0.02);
  };

  return (
    <div className="min-h-screen bg-gray-200 p-3 md:p-6">

      {/* HEADER */}
      <h1 className="text-xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-700">
        Deal Pipeline
      </h1>

      {/* ✅ MOBILE SCROLL WRAPPER */}
      <div className="overflow-x-auto">
        <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-5 min-w-[900px] md:min-w-0">

          {stages.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage);

            return (
              <div
                key={stage}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, stage)}
                className={`rounded-xl p-3 md:p-4 border-2 ${stageColors[stage]} shadow-md w-[260px] md:w-auto flex-shrink-0`}
              >

                {/* HEADER */}
                <div className="flex justify-between items-center mb-3 md:mb-4">
                  <h2 className="font-bold text-sm md:text-lg">{stage}</h2>

                  <span className="text-xs md:text-sm bg-white px-2 py-1 rounded-full shadow">
                    {stageDeals.length}
                  </span>
                </div>

                {/* CARDS */}
                {stageDeals.map(deal => (

                  <div
                    key={deal._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal)}
                    onClick={() => handleClick(deal._id)}
                    className="bg-white p-3 md:p-4 rounded-xl shadow hover:shadow-lg transition-all mb-3 cursor-pointer active:scale-95"
                  >

                    {/* CLIENT */}
                    <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate">
                      {deal.clientId?.name || "No Client"}
                    </h3>

                    {/* PROPERTY */}
                    <p className="text-gray-600 text-xs md:text-sm mt-1 truncate">
                      {deal.propertyId?.title || deal.propertyTitle||"No Property"}
                    </p>

                    {/* LOCATION */}
                    <p className="text-gray-500 text-[11px] md:text-xs truncate">
                      {deal.propertyId?.location || deal.propertyLocation|| "No Location"}
                    </p>

                    {/* PRICE */}
                    <p className="text-indigo-600 font-semibold mt-1 text-sm md:text-base">
                      ₹ {deal.price?.toLocaleString() || 0}
                    </p>

                    {/* COMMISSION */}
                    <p className="text-green-600 text-xs md:text-sm mt-1 font-medium">
                      ₹ {deal.commission || calculateCommission(deal.price)}
                    </p>

                    {/* BUTTON */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/deal/${deal._id}`);
                      }}
                      className="mt-2 text-[11px] md:text-xs text-indigo-600 underline"
                    >
                      View Details
                    </button>

                  </div>

                ))}

              </div>
            );
          })}

        </div>
      </div>

    </div>
  );
}

export default DealsBoard;
