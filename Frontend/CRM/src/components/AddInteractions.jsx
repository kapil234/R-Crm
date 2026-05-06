import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import SummaryApi from "../common"
import Context from "../context"
import { useContext } from "react"
function AddInteraction(){

  const navigate = useNavigate()
  const { id } = useParams()
const{ fetchGlobalData}=useContext(Context);
  const [type,setType] = useState("Call")
  const [note,setNote] = useState("")
  const [date,setDate] = useState("")
  const [loading,setLoading] = useState(false)

  const handleSubmit = async () => {

    if(!note){
      alert("Please enter interaction note")
      return
    }

    try{

      setLoading(true)

      const response = await fetch(
        SummaryApi.addInteractions.url,
        {
          method:SummaryApi.addInteractions.method,
          headers:{
            "Content-Type":"application/json"
          },
          credentials:"include",
          body: JSON.stringify({
            clientId:id,
            type,
            note,
            date
          })
        }
      )

      const data = await response.json()

      if(data.success){
      
  await fetchGlobalData();   // ❗ add this too
  alert("Interaction Added Successfully");
  navigate(-1);
}
       

    }catch(err){
      console.log(err)
    }finally{
      setLoading(false)
    }
  }

  return(

    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">

        <h2 className="text-xl font-bold mb-5 text-gray-700">
          Add Client Interaction
        </h2>

        {/* Interaction Type */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">
            Interaction Type
          </label>

          <select
            value={type}
            onChange={(e)=>setType(e.target.value)}
            className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          >
            <option>Call</option>
            <option>Meeting</option>
            <option>Email</option>
            <option>Visit</option>
          </select>
        </div>

        {/* Date Picker */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">
            Interaction Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e)=>setDate(e.target.value)}
            className="w-full mt-1 border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Note */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">
            Interaction Notes
          </label>

          <textarea
            value={note}
            onChange={(e)=>setNote(e.target.value)}
            placeholder="Write interaction details..."
            className="w-full mt-1 border rounded-lg p-2 h-24 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">

          <button
            onClick={()=>navigate(-1)}
            className="w-full border rounded-lg py-2 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save Interaction"}
          </button>

        </div>

      </div>

    </div>

  )
}



export default AddInteraction