const express = require("express")
const dotenv = require("dotenv");
const chats = require("./data/data");
const cors = require("cors");
const connectDB = require("./config/db");
const authRouter = require("./routes/authRouter.js")
const userRouter = require("./routes/userRouter.js")
const chatRouter = require("./routes/chatRouter.js")
const messageRouter = require("./routes/messageRouter.js")

const app = express();
connectDB();
dotenv.config();
app.use(express.json());
app.use(cors())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)
app.use("/api/chat",chatRouter)
app.use("/api/message",messageRouter)

app.get("/",(req,res) => {
    res.send("Backend is working fine")
})


const PORT = process.env.PORT || 3003

const server = app.listen(PORT, console.log(`Server is running on port ${PORT}`));

const io = require("socket.io")(server,{
    pingTimeout : 60000,
    cors : {
        origin : "https://prathipan-chat-application.netlify.app"
    }
})

io.on("connection", (socket) => {
  console.log("connected to socket.io")

  socket.on("setup",(userData) => {
    socket.join(userData._id);
    // console.log(userData._id);
    socket.emit("connected");
  })

  socket.on("join chat" , (room) => {
    socket.join(room);
    console.log("User Joined room : " + room);
  })

  socket.on("typing",(room) => socket.in(room).emit("typing"));
  socket.on("stopTyping",(room) => socket.in(room).emit("stop typing"))

  socket.on("new message" , (newMessageReceived) => {
    var chat = newMessageReceived.chat;

    if(!chat.users) return console.log("chat.users not defined");

   chat.users.forEach( user => {
    if(user._id == newMessageReceived.sender._id) return;

    socket.in(user._id).emit("message received",newMessageReceived);
   })
  })

  socket.off("setup",() => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  })


})