import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {v2 as cloudinary} from "cloudinary"

export const avatarUploader={
    storage:new CloudinaryStorage({
        cloudinary,
        params:{
            folder:"ChatRooms/User"
        }as {folder:string}
    })
}


export const chatRoomPictureUploader={
    storage:new CloudinaryStorage({
        cloudinary,
        params:{
            folder:"ChatRooms/Pictures"
        } as {folder:string}
    })
}