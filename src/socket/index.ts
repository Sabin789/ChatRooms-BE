import { Socket } from "socket.io";
import jwt from "jsonwebtoken"
import MessageModel from "../Api/Messages/model"
import ChatModel from "../Api/ChatRooms/model";

let onlineUserList: any = []
let newRoom: string
let displayedMessages: any = []


export const newConnectionHandler=(socket:Socket)=>{
  console.log(`New userJoined their id is ${socket.id}`)
  socket.emit("Welcome", socket.id)

  socket.on("SetUser",(data:{token:string})=>{
    const { token } = data
    const secret = process.env.JWT_SECRET as string

    jwt.verify(token, secret, (err, decoded: any) => {
        if (err) {
            console.log("Token verification failed:", err);
          } else {
            onlineUserList.push({
                email: decoded.email,
                _id: decoded._id,
                socketId: socket.id,
              });
              console.log('Token verification successful:', decoded);
              console.log(onlineUserList);
          }
    })
  })
  socket.on("join-room",(room)=>{
    console.log(room)
    newRoom=room
    console.log(newRoom);
    socket.join(room)
  })

  socket.on("outgoing-msg",async ({ room, message }: { room: string; message: any }) =>{
    console.log(room)
    // const chatRoomId = await ChatModel.create({ room:Chat })
  })


  socket.on("incoming-msg", async ({ room }: { room: string }) => {

  })

  socket.on("disconnect", () => {
    onlineUserList = onlineUserList.filter(
      (a: any) => a.socketId !== socket.id
    )})




    socket.broadcast.emit("updateOnlineUsersList", onlineUserList);
    console.log(`User with socketId of ${socket.id} disconnected`);
    console.log(onlineUserList);

}