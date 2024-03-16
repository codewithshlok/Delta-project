const mongoose = require("mongoose")
const initData = require("./data1.js")
const Listing = require("../models/listing.js")

// connectiong databases
const mongoUrl = "mongodb://127.0.0.1:27017/mywonderlust"
async function main(){
    await mongoose.connect(mongoUrl)
}

main().then(()=>{
    console.log("Database has been successfull connected")
}).catch((err)=>{
    console.log(err)
})


const initDB = async ()=>{
    await Listing.deleteMany({})
    initData.data = initData.data.map((obj)=>({...obj,owner : "65e309514e231ad5e8029fb1"}))
    await Listing.insertMany(initData.data)
    console.log("data was initialized")

}
initDB();