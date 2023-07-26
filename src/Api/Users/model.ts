import { DataTypes, Model } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../../db";
import { UserAttributes, UserInstance } from "./types";
import MessageModel from "../Messages/model";
import ChatModel from "../ChatRooms/model";




const UserModel= sequelize.define<UserInstance,UserAttributes>("user",{
    UserId:{
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: 'Please fill a valid email address'
          }
        }
    },
    password:{
        type:DataTypes.STRING(255),
        allowNull: false
    },
    bio:{
        type:DataTypes.STRING(255),
        allowNull: true
    },
    refreshToken: { 
        type:DataTypes.STRING(255),
     },
    avatar:{
        type:DataTypes.STRING(255),
        allowNull: true
    },
   
    role: {
        type: DataTypes.ENUM('Admin', 'Moderator', 'User'),
        allowNull: false,
        defaultValue: 'User',
    }
    

},{
    tableName: 'users', // Optional: Set the table name explicitly
    timestamps: true 
  })





UserModel.beforeCreate(async (user) => {
  
    if (user.getDataValue('password')) {
      const hashedPassword = await bcrypt.hash(user.getDataValue('password'), 13);
      user.setDataValue('password', hashedPassword);
    }
});
  
UserModel.beforeUpdate(async (user) => {
    if (user.getDataValue('password')) {
      const hashedPassword = await bcrypt.hash(user.getDataValue('password'), 13);
      user.setDataValue('password', hashedPassword);
    }
});


UserModel.prototype.toJSON = function () {
    const user = this;
    const userObj = user.get();
  
    delete userObj.password;
    delete userObj.createdAt;
    delete userObj.updatedAt;
    delete userObj.__v;
  
    return userObj;
};

UserModel.prototype.checkCredentials = async function (email: string, password: string): Promise<UserInstance | null> {
    const user = this as UserInstance;
    
    // Perform your credentials checking logic here
    // For example, compare the provided email and password with the user's stored credentials
    if (user.email === email && user.password === password) {
      return user;
    } else {
      return null;
    }
}


UserModel.hasMany(MessageModel,{foreignKey:{name:"MessageId",allowNull:false}})


export default UserModel