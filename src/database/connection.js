const dotenv = require('dotenv');
dotenv.config({path:'./.env'});
const mongoose = require('mongoose');
const dbURL = process.env.DATABASEURL;

mongoose.connect(dbURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log(`Database Connected`);
}).catch((err)=>{
    console.log(err);
})