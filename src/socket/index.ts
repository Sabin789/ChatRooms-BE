import { Socket } from "socket.io";
import jwt from "jsonwebtoken"
import MessageModel from "../Api/Messages/model"
import ChatModel from "../Api/ChatRooms/model";

let onlineUserList: any = []
let newRoom: string
let displayedMessages: any = []


// interface MySocket extends Socket {
//     data: any; 
//   }
let userId:any
export const newConnectionHandler=(socket:Socket)=>{
  console.log(`New userJoined their id is ${socket.id}`)
  socket.emit("Welcome", socket.id)

  socket.on("SetUser",(data:{token:string})=>{
    const { token } = data
  
    const secret = process.env.JWT_SECRET as string
    
    jwt.verify(token, secret, (err, decoded: any) => {
      
        if (err) {
            console.log("token",token)
            console.log("Token verification failed:", err);
          } else {
            socket.data = decoded
            userId=decoded._id
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
  console.log(socket.data)
  socket.on("join-room", async (data: { room: string }) => {
    
    const user = socket.data
    console.log("Data:",user)
    const newMembers:any=[]
    console.log(data.room)
    if (!user) {
      console.log("User not found. Please authenticate first.");
      return;
    }
  
    const chatRoom = await ChatModel.findByPk(data.room);
  
    if (!chatRoom) {
 
      console.log(`Chat room with ID ${data.room} not found.`);
      return;
    }

    newMembers.push(user._id)
    console.log(user)
    console.log(newMembers)
    await chatRoom.update({
        members:newMembers,
      })

    console.log(`User with ID ${user} joined chat room with ID ${data.room}`);
  
    socket.join(data.room);
  });


  socket.on("outgoing-msg",async ({ room, message }: { room: string; message: any }) =>{
    console.log(room)
    // const chatRoomId = await ChatModel.create({ room:Chat })
  })


  socket.on("incoming-msg", async ({ room }: { room: string }) => {

  })


socket.on("leave-room",async (data: { room: string })=>{
    try {
        const user = socket.data
        console.log("Data:",user)
        let newMembers:any=[]
        
        console.log(data.room)
        if (!user) {
          console.log("User not found. Please authenticate first.");
          return;
        }
      
        const chatRoom = await ChatModel.findByPk(data.room);
      
        if (!chatRoom) {
     
          console.log(`Chat room with ID ${data.room} not found.`);
          return;
        }

        newMembers=chatRoom.members
        newMembers=newMembers.filter((a: any) => a !== userId)
        console.log("user:",user,"socket:",socket.id)
        console.log("newmemes",chatRoom.members)
        await chatRoom.update({
            members:newMembers,
          })

        console.log(`User with ID ${user._id} left chat room with ID ${data.room}`);
        socket.leave(data.room);
    } catch (error) {
        console.log(error)
    }
})
//   socket.on("disconnect", () => {
//     onlineUserList = onlineUserList.filter(
//       (a: any) => a.socketId !== socket.id
//     )})



}