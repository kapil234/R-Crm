
const backendDomain= import.meta.env.VITE_BACKEND_URL
const SummaryApi = {
    allProperties : {
        url : `${backendDomain}/api/allProperties`,
        method : "get"
    },
    leads:{
        url:`${backendDomain}/api/allLead`,
        method : "get"
    },
    leadcreate:{
        url:`${backendDomain}/api/lead/create`,
        method : "post"      
    },
    login:{
        url:`${backendDomain}/api/signin`,
        method:"post"
    },
    Signup:{url:`${backendDomain}/api/signup`,
        method:"post"

    },
    propertydetail:{
      url:`${backendDomain}/api/propertydetail`,
      method:"get"
    },
    allClients:{
        url:`${backendDomain}/api/allClients`,
      method:"GET"
    },
    clientdetails:{
      url:`${backendDomain}/api/client`,
      method: "get"
    },
    updateLeadStatus:{
      url:`${backendDomain}/api/update-lead-status`,
      method: "put"
    },
    addInteractions:{
        url:`${backendDomain}/api/client/addInteractions`,
      method: "post"
    },
    alldeals:{
     url:`${backendDomain}/api/alldeals`,
      method: "Get"
    },
    updateDealstage:{
      url:`${backendDomain}/api/deal/updatedealstage`,
      method: "put"
    },
    getDealById:{
       url:`${backendDomain}/api/getDeal`,
      method: "get"
    },
    
      User:{
        url:`${backendDomain}/api/userdetails`,
      method: "get"
      },
      logout:{
           url:`${backendDomain}/api/logout`,
      method: "get"
      },
      addDealDocument:{
         url:`${backendDomain}/api/deal/addDealDocument`,
      method: "post"
      },
      agent:{
        url:`${backendDomain}/api/agents`,
      method: "get"
      },
      addFollowUp:{
        url:`${backendDomain}/api/client/addFollowUp`,
        method:"post"
      },
      getFollowup:{
        url:`${backendDomain}/api/get/followsup`,
        method:"get"
      },
      allactivity:{
        url:`${backendDomain}/api/get/activity/all`,
        method:"get"
      },
      dealDelete:{
       url:`${backendDomain}/api/deal/delete`,
        method:"delete"
      },
      GoogleAuth:{
        url:`${backendDomain}/api/auth/google`,
        method:"post"
      },
      addClient:{
        url:`${backendDomain}/api/client/add`,
        method:"post"
      },
      deleteClient: {
      url: `${backendDomain}/api/client/delete`,
      method: "delete"
},
  addLead: {
  url: `${backendDomain}/api/lead/add`,
  method: "POST"
},
deleteLead: {
  url: `${backendDomain}/api/lead/delete`,
  method: "DELETE"
},
updateProperty:{
   url: `${backendDomain}/api/property/updateProperty`,
  method: "put"
},
addProperty:{
   url: `${backendDomain}/api/addproperty`,
  method: "post"
},
deleteProperty:{
  url: `${backendDomain}/api/property/delete`,
  method: "Delete"
}

}
export default SummaryApi;
