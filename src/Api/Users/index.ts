import  Express, { response }  from "express";
import createHttpError from "http-errors";
import passport from "passport";
import { JWTTokenAuth, UserRequest } from "../../lib/auth/jwt";
import { createAccessToken, createRefreshToken } from "../../lib/auth/tools";
import { avatarUploader } from "../../lib/cloudinary";
import UserModel from "./model";

const UsersRouter=Express.Router()


UsersRouter.post("/", async (req,res,next)=>{
    try{
        const exists = await UserModel.findOne({ where: { email: req.body.email } });
        if(exists){
        res.status(409).send(`${req.body.email} is already in use"`)
      }else{
        const {UserId}= await UserModel.create(req.body)
        res.status(201).send({UserId})
      }
    
    }catch(err){
    console.error('Error creating user:', err)
      next(err)
    }
})


UsersRouter.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ where: { email } });
  
      if (!user) {
        next(createHttpError(401, "Wrong Credentials!"));
      } else {
        const authenticatedUser = await user.checkCredentials(email, password);
  
        if (!authenticatedUser) {
          next(createHttpError(401, "Wrong Credentials!"));
        } else {
          const payload = {
            email: authenticatedUser.email,
            _id: authenticatedUser.UserId,
            role: authenticatedUser.role,
          };
  
          const accessToken = await createAccessToken(payload);
          const refreshToken = await createRefreshToken(payload);
  
          res.send({ user: authenticatedUser, accessToken, refreshToken });
        }
      }
    } catch (err) {
      console.log(err)
      next(err);
    }
  });


UsersRouter.get("/me", JWTTokenAuth, async (req, res, next) => {
    try {
      const user = await UserModel.findByPk((req as UserRequest).user._id);
      res.send(user);
    } catch (error) {
      next(error);
    }
})


UsersRouter.get("/",JWTTokenAuth, async (req,res,next)=>{
    try{
       const users=await UserModel.findAll()
       res.send(users)
    }catch(err){
        next(err)
    }
})


UsersRouter.get("/:id",JWTTokenAuth,async (req,res,next)=>{
    try{
      const user=await UserModel.findByPk(req.params.id)
      if(user){
        res.status(200).send(user)
      }else{
        createHttpError(404,"User does not exist")
      }
    }catch(err){
        next(err)
    } 
})


UsersRouter.put("/:id",JWTTokenAuth, async (req,res,next)=>{
    try{
        const user=await UserModel.findByPk(req.params.id)
        if(user){
            const [updatedRowCount, updatedUsers] = await UserModel.update(req.body, {
                where: { UserId: req.params.id },
                returning: true,
              });
            
              if (updatedRowCount === 0) {
                res.send("No user with that id exists")
              } else {

                res.send(updatedUsers);
              }
             
          }else{
            createHttpError(404,"User does not exist")
        } 
    }catch(err){
        next(err)
    }
})

UsersRouter.delete("/me/session",JWTTokenAuth,async(req,res,next)=>{
    try {
        const user=await UserModel.findByPk((req as UserRequest).user._id)
        if(user){
            user.refreshToken = ""
            await user.save()
      
            res.send("Refresh token deleted successfully")
        }else{
            res.send("No session to delete")
        }
    } catch (err) {
        next(err)
    }
})


UsersRouter.delete("/:id",JWTTokenAuth, async (req,res,next)=>{
    try{
        const user=await UserModel.findByPk(req.params.id)
        if(user){
            const deletedRowCount = await UserModel.destroy({
                where: { UserId: req.params.id },
              });
            
              if (deletedRowCount === 0) {
                createHttpError(404,"No user with that id found")
              } else {
                res.send(`User with id ${req.params.id} deleted`);
              }
    }else{
        createHttpError(404,"User does not exist")
    }}catch(err){
        next(err)
    }
})




export default UsersRouter