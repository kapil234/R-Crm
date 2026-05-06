const express=require("express")
const router=express.Router();

const allProperties=require("../controllers/allProperties")
const allLead=require("../controllers/allLeads")
const addProperties = require("../controllers/addProperties");
const addLead=require("../controllers/addLead");

const userSignUp = require("../controllers/signUp");
const userSignIn = require("../controllers/signIn");
const authToken = require("../middleware/authToken");
const propertyDetail = require("../controllers/propertyDetail");
const createLead = require("../controllers/createLead");
const addClient = require("../controllers/addClient");
const clientDetails = require("../controllers/clientDetails");
const allClients = require("../controllers/clients");
const updateLeadstatus = require("../controllers/updateLeadstatus");
const addInteraction = require("../controllers/addInteraction");
const allDeals = require("../controllers/deal");
const updateDealStage = require("../controllers/updateDealstage");
const getDeal = require("../controllers/getDeal");
const userDetailsController = require("../controllers/userDetails");
const Logout = require("../controllers/Logout");
const deleteProperty = require("../controllers/deleteProperty");
const updateProperty = require("../controllers/updateProperty");
const allActivity = require("../controllers/allActivity");
const getFollowsUp = require("../controllers/getfollowsup");
const addFollowUp = require("../controllers/addFollowup");
const addDealDocument = require("../controllers/adDealdocument");
const agentList = require("../controllers/agentsList");
const getAgentDetails = require("../controllers/agentDetails");
const dealDelete = require("../controllers/deleteDeal");
const googleAuth = require("../controllers/googleAuth");
const deleteClient = require("../controllers/deleteClient");
const deleteLead=require("../controllers/deleteLead");


router.post("/addproperty",authToken,addProperties);
router.post("/lead/add",authToken,addLead)
router.get("/allProperties",allProperties);
router.get("/allLead",authToken,allLead);
router.post("/signin",userSignIn);
router.post("/signup",userSignUp);
router.get("/propertydetail/:id",propertyDetail)
router.post("/lead/create/:propertyId",createLead)
router.post("/client/add",authToken,addClient)
router.get("/client/:id",authToken,clientDetails)
router.get("/allClients",authToken,allClients)
router.put("/update-lead-status/:id",authToken, updateLeadstatus)
router.post("/client/addInteractions",authToken,addInteraction)
router.get("/alldeals",authToken,allDeals)
router.put("/deal/updatedealstage/:id",authToken,updateDealStage)
router.get("/getDeal/:id",authToken,getDeal)
router.get("/userdetails",authToken,userDetailsController)
router.get("/logout",Logout)
router.delete("/property/delete/:id",authToken,deleteProperty)
router.put("/property/updateProperty/:id",authToken,updateProperty)
router.get("/get/activity/all",authToken,allActivity)
router.get("/get/followsup",authToken,getFollowsUp)
router.post("/client/addFollowUp",authToken,addFollowUp)
router.post("/deal/addDealDocument/:id/document",authToken,addDealDocument)
router.get("/agents",authToken,agentList)
router.get("/agents/:id",authToken,getAgentDetails)
router.delete("/deal/delete/:id",authToken,dealDelete)
router.post("/auth/google", googleAuth),
router.delete("/client/delete/:id",authToken,deleteClient)
router.delete("/lead/delete/:id",authToken,deleteLead)
module.exports= router