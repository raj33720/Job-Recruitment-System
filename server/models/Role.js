
const mongoose=require('mongoose')

const RoleSchema=new mongoose.Schema({
    applicantName: { type: String, required: true },
    jobRole: { type: String, required: true },
    track: { type: String, default: "" },
    appliedAt: { type: Date, default: Date.now }
});


const RoleModel=mongoose.model("JobRole",RoleSchema)
module.exports=RoleModel
