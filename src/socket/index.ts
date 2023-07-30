import { Socket } from "socket.io";
import jwt from "jsonwebtoken"
import MessageModel from "../Api/Messages/model"
import ChatModel from "../Api/ChatRooms/model";

let onlineUserList: any = []
let newRoom: string
let displayedMessages: any = []


interface MySocket extends Socket {
    data: any; 
  }

export const newConnectionHandler=(socket:Socket)=>{
  console.log(`New userJoined their id is ${socket.id}`)
  socket.emit("Welcome", socket.id)

  socket.on("SetUser",(data:{token:string})=>{
    const { token } = data
    const secret = process.env.JWT_SECRET as string
    
    jwt.verify(token, secret, (err, decoded: any) => {
        console.log("Verifi")
        if (err) {
            console.log("Token verification failed:", err);
          } else {
            socket.data = decoded
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
  socket.emit("SetUser")
  console.log(socket.data)
  socket.on("join-room", async (room: string) => {
    
    const user = socket.data
    console.log("Data:",user)
    const newMembers:any=[]
    if (!user) {
      console.log("User not found. Please authenticate first.");
      return;
    }
  
    const chatRoom = await ChatModel.findByPk(room);
  
    if (!chatRoom) {
 
      console.log(`Chat room with ID ${room} not found.`);
      return;
    }

    newMembers.push(user)
    console.log(newMembers)
    await chatRoom.update({
        members:newMembers,
      })

    console.log(`User with ID ${user} joined chat room with ID ${room}`);
  
    socket.join(room);
  });


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




    // socket.broadcast.emit("updateOnlineUsersList", onlineUserList);
    // console.log(`User with socketId of ${socket.id} disconnected`);
    // console.log(onlineUserList);

}