import express from "express";
import {createServer} from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import {Server} from 'socket.io'
import {connectToSocket} from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";
import 'dotenv/config';

const app=express();
const server=createServer(app);
const io=connectToSocket(server);

app.set("port",(process.env.PORT));
app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb",extended:true}));

app.use("/api/v1/users",userRoutes);
// app.use("/api/v2/users",newUserRoutes);

app.get("/home",(req,res)=>{
    return res.json({"shree":"shyam"});
});

const start=async()=>{
    const connectionDB=await mongoose.connect(process.env.MongoDB_key)
    console.log(`Database connected host: ${connectionDB.connection.host}`);
    server.listen(app.get("port"),()=>{
        console.log("Server is running on port 8000");
    })
};
start();