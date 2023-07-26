import  Express, { response }  from "express";
import createHttpError from "http-errors";
import { JWTTokenAuth, UserRequest } from "../../lib/auth/jwt";
import UserModel from "../Users/model";
import ChatModel from "./model";


const ChatRouter=Express.Router()
ChatRouter.post("/", JWTTokenAuth, async (req, res, next) => {
    try {
      const host = await UserModel.findByPk((req as UserRequest).user._id);
  
      if (!host) {
        return res.status(404).send("User does not exist");
      } else {
    
        const newChat = await ChatModel.create({
            ...req.body,
            UserId: host.UserId, // Set the foreign key for the association
          })
        res.status(201).send(newChat);
      }
    } catch (err) {
      next(err);
    }
});
  

ChatRouter.get("/",JWTTokenAuth, async (req,res,next)=>{
    try {
        const chats=await ChatModel.findAll()
        res.send(chats)
    } catch (error) {
        next(error)
    }
})

ChatRouter.get("/:id",JWTTokenAuth,async (req,res,next)=>{
    try {
        const chat=await ChatModel.findByPk(req.params.id)
        if(chat){
            res.send(chat)
        }else{
            createHttpError(404,"Chat Room does not exist")

        }
    } catch (error) {
        next(error)
    }
})

ChatRouter.put("/:id",JWTTokenAuth,async(req,res,next)=>{
   try {
    const host = await UserModel.findByPk((req as UserRequest).user._id);

    const chat=await ChatModel.findByPk(req.params.id)
    if(chat){
      if(chat.UserId===host?.UserId){
        const [updatedRowCount,UpdatedChats]= await ChatModel.update(req.body,{
            where: { ChatId: req.params.id },
            returning: true
        })
        if (updatedRowCount === 0) {
            res.send("No chat with that id exists")
          } else {
            res.send(UpdatedChats);
          }
      }else{
        res.status(403).send("You are not authorized to update this chat.");
      }
    }else{
        createHttpError(404,"Chat Room does not exist")
    }
   } catch (error) {
    next(error)
   }
})

ChatRouter.delete("/:id", JWTTokenAuth,async(req,res,next)=>{
    try {
      const host = await UserModel.findByPk((req as UserRequest).user._id);

      const chat=await ChatModel.findByPk(req.params.id)

      if(chat){
        if(chat.UserId===host?.UserId){
            const deletedRowCount=await ChatModel.destroy({
                where: { ChatId: req.params.id },
            })
            if(deletedRowCount===0){
                createHttpError(404,"No Chat with that id found")
            }else{
                res.send(`Chat with the id ${chat.ChatId} Deleted`)
            }
        }else{
            createHttpError(403, "You are not authorized to delete this chat.");
        }
      }else{
        createHttpError(404,"Chat Room does not exist")
      }
    } catch (error) {
        next(error)
    }
})

export default ChatRouter