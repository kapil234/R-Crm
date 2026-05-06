import React, { useState, useEffect,useCallback,useMemo} from "react";
import { useParams } from "react-router-dom";
import SummaryApi from "../common";
import uploadImage from "../components/uploadImages";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import Context from "../context";

const stages = ["Inquiry", "Negotiation", "Agreement", "Closed"];

function DealDetail() {

 const { id } = useParams();
 const navigate=useNavigate();
 const { setGlobalData } = useContext(Context);

  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [uploading, setUploading] = useState(false);
  const [updatingStage, setUpdatingStage] = useState(false);

  // ================= FETCH =================
  const fetchDeal = useCallback(async () => {
    try {
      const res = await fetch(`${SummaryApi.getDealById.url}/${id}`, {
        method: SummaryApi.getDealById.method,
        credentials: "include"
      });

      const data = await res.json();

      if (data.success) {
        setDeal(data.data);
      }

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDeal();
  }, [fetchDeal]);

  // ================= DERIVED =================
  const currentIndex = useMemo(() => {
    return stages.indexOf(deal?.stage);
  }, [deal]);

  // ================= MOVE NEXT =================
  const moveNext = useCallback(async () => {
    if (!deal) return;

    const currentIndex = stages.indexOf(deal.stage);
    if (currentIndex >= stages.length - 1) return;

    const nextStage = stages[currentIndex + 1];

    try {
      setUpdatingStage(true);

      await fetch(`${SummaryApi.updateDealstage.url}/${deal._id}`, {
        method: SummaryApi.updateDealstage.method,
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ stage: nextStage })
      });

      await fetchDeal();

    } catch (err) {
      console.log(err);
    } finally {
      setUpdatingStage(false);
    }
  }, [deal, fetchDeal]);

  // ================= FILE UPLOAD =================
  const handleFileUpload = useCallback(async (file, name) => {
    if (!file || !deal) return;

    try {
      setUploading(true);

      const uploaded = await uploadImage(file);

      await fetch(`${SummaryApi.addDealDocument.url}/${deal._id}/document`, {
        method: SummaryApi.addDealDocument.method,
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          fileUrl: uploaded.url
        })
      });

      await fetchDeal();

    } catch (err) {
      console.log(err);
    } finally {
      setUploading(false);
    }
  }, [deal, fetchDeal]);

  // ================= UI STATES =================
  if (loading) return <div className="p-6">Loading...</div>;
  if (!deal) return <div className="p-6">No deal found</div>;

  //const currentIndex = stages.indexOf(deal.stage);
  const deleteDeal = async (id) => {
  try {
    const res = await fetch(`${SummaryApi.dealDelete.url}/${id}`, {
      method: SummaryApi.dealDelete.method,
      credentials: "include",
    });

    const data = await res.json();

    if (data.success) {
        setGlobalData(prev => ({
        ...prev,
        deals: prev.deals.filter(d => d._id !== id)
      }));
      navigate("/deals");
    } else {
      console.error(data.message);
    }
  } catch (err) {
    console.error("Delete error:", err);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* HEADER */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow mb-6 flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">
            {deal.clientId?.name}
          </h1>

          <p className="text-gray-500 text-sm md:text-base">
            {deal.propertyId?.title} • {deal.propertyId?.location}
          </p>

          <div className="flex flex-wrap gap-2 md:gap-4 mt-3">
            <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs md:text-sm">
              {deal.stage}
            </span>

            <span className="font-semibold text-sm md:text-base">
              ₹ {deal.price?.toLocaleString()}
            </span>

            <span className="text-green-600 font-semibold text-sm md:text-base">
              ₹ {deal.commission?.toLocaleString()}
            </span>
          </div>
        </div>

        <button onClick={() => deleteDeal(deal._id)} className="bg-indigo-600 text-white px-5 py-2 rounded-xl w-full md:w-auto">
          Delete
        </button>
      </div>

      {/* PIPELINE */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow mb-6">
        <h2 className="font-semibold mb-4">Deal Progress</h2>

        <div className="flex items-center w-full">
          {stages.map((step, i) => {

            const isCompleted =
              i < currentIndex || deal.stage === "Closed";

            const isActive = i === currentIndex;

            return (
              <div key={step} className="flex items-center w-full">

                <div
                  className={`px-2 md:px-3 py-1 text-[10px] md:text-sm rounded-full text-center flex-shrink-0 ${
                    isCompleted
                      ? "bg-green-100 text-green-600"
                      : isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step}
                </div>

                {i !== stages.length - 1 && (
                  <div
                    className={`flex-1 h-[2px] md:h-[3px] mx-1 md:mx-2 ${
                      isCompleted ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* INFO GRID (UNCHANGED) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

        <div className="bg-white p-4 md:p-5 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">Client Info</h2>
          <p><strong>Name:</strong> {deal.clientId?.name}</p>
          <p><strong>Phone:</strong> {deal.clientId?.phone}</p>
          <p><strong>Email:</strong> {deal.clientId?.email}</p>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">Property Info</h2>
          <p><strong>Title:</strong> {deal.propertyId?.title}</p>
          <p><strong>Location:</strong> {deal.propertyId?.location}</p>
        </div>

        <div className="bg-white p-4 md:p-5 rounded-2xl shadow">
          <h2 className="font-semibold mb-3">Agent Info</h2>
          <p><strong>Name:</strong> {deal.agentId?.name}</p>
          <p><strong>Email:</strong> {deal.agentId?.email}</p>
          <p><strong>Phone:</strong> {deal.agentId?.phone}</p>

          <button className="mt-3 w-full bg-green-500 text-white py-2 rounded-lg">
            Contact Agent
          </button>
        </div>

      </div>

      {/* STAGE UI */}
      <div className="bg-white p-4 md:p-6 rounded-2xl shadow mt-6">

        <h2 className="font-semibold mb-4 text-lg">
          {deal.stage} Phase
        </h2>

        {/* INQUIRY */}
        {deal.stage === "Inquiry" && (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg text-sm">
              New inquiry received. Contact client.
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes..."
              className="w-full border p-3 rounded-lg"
            />
          </div>
        )}

        {/* NEGOTIATION */}
        {deal.stage === "Negotiation" && (
          <div className="space-y-4">

            {notes && (
              <div className="bg-blue-50 p-3 rounded text-sm">
                <strong>Inquiry Notes:</strong> {notes}
              </div>
            )}

            <div className="bg-yellow-50 p-4 rounded-lg text-sm">
              Negotiate price with client.
            </div>

            <input
              type="number"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              placeholder="Enter offer price"
              className="w-full border p-3 rounded-lg"
            />
          </div>
        )}

        {/* AGREEMENT */}
        {deal.stage === "Agreement" && (
          <div className="space-y-5">

            {notes && (
              <div className="bg-blue-50 p-3 rounded text-sm">
                <strong>Inquiry Notes:</strong> {notes}
              </div>
            )}

            {offerPrice && (
              <div className="bg-yellow-50 p-3 rounded text-sm">
                <strong>Negotiation Price:</strong> ₹ {offerPrice}
              </div>
            )}

            <div className="bg-purple-50 p-4 rounded-lg text-sm">
              Upload agreement & verify documents
            </div>

            <div className="space-y-2 text-sm">
              <label><input type="checkbox" /> Agreement Signed</label><br />
              <label><input type="checkbox" /> Payment Received</label><br />
              <label><input type="checkbox" /> KYC Done</label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="border-2 border-dashed p-4 text-center rounded-xl">
                Upload Agreement
                <input
                  type="file"
                  className="mt-2"
                  onChange={(e) =>
                    handleFileUpload(e.target.files[0], "Agreement")
                  }
                />
              </div>

              <div className="border-2 border-dashed p-4 text-center rounded-xl">
                Upload Receipt
                <input
                  type="file"
                  className="mt-2"
                  onChange={(e) =>
                    handleFileUpload(e.target.files[0], "Receipt")
                  }
                />
              </div>

            </div>

          </div>
        )}

        {/* CLOSED */}
        {deal.stage === "Closed" && (
          <div className="space-y-4">

            <div className="bg-green-50 p-4 rounded-lg font-semibold text-green-700 text-sm">
              🎉 Deal Closed Successfully!
            </div>

            {notes && <p><strong>Notes:</strong> {notes}</p>}
            {offerPrice && <p><strong>Final Price:</strong> ₹ {offerPrice}</p>}

            {/* ✅ ADDED DOCUMENT LIST ONLY */}
            {deal.documents?.length > 0 && (
              <div>
                {deal.documents.map((doc, index) => (
                  <div key={index}>
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer" download>
                      {doc.name}
                    </a>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* NEXT BUTTON */}
        {deal.stage !== "Closed" && (
          <button
            onClick={moveNext}
            className="mt-4 bg-indigo-600 text-white px-5 py-2 rounded-lg w-full md:w-auto"
          >
            Next →
          </button>
        )}

      </div>

    </div>
  );
}
export default DealDetail;
