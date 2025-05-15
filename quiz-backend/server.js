const express = require("express");          
const mongoose = require("mongoose");        
const cors = require("cors");                
require("dotenv").config();                  

const app = express();                       

app.use(cors());                             
app.use(express.json());                      
app.use("/uploads", express.static("uploads"));  

const authRoutes = require("./routes/authRoutes");             
const quizRoutes = require("./routes/quizRoutes");              
const submissionRoutes = require("./routes/submissionRoutes");  

app.use("/api/auth", authRoutes);             
app.use("/api/quizzes", quizRoutes);         
app.use("/api/submissions", submissionRoutes);  

mongoose.connect(process.env.MONGO_URI)       
  .then(() => {
    app.listen(process.env.PORT, () => {     
      console.log("MongoDB connected successfully!");
      console.log("Server running on port", process.env.PORT);
    });
  })
  .catch(err => console.error(err));        
