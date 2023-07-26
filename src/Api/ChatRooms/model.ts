import sequelize from "../../db";
import { DataTypes } from "sequelize";
import { ChatDoc, ChatInstance } from "./types";
import UserModel from "../Users/model";
import MessageModel from "../Messages/model";

const ChatModel = sequelize.define<ChatInstance, ChatDoc>("Chat", {
    ChatId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    UserId: {
        type: DataTypes.STRING,
        allowNull: false,
      }
  })

// ChatModel.belongsToMany(UserModel, {
//     through: "ChatUser", // This should be the name of the intermediate table
//     as: "members",
//     foreignKey: "chatId", // This should be the foreign key in the intermediate table that refers to the ChatModel
//   });
  
//   UserModel.belongsToMany(ChatModel, {
//     through: "ChatUser", // This should be the name of the intermediate table
//     as: "chats",
//     foreignKey: "userId", // This should be the foreign key in the intermediate table that refers to the UserModel
//   });
  
//   ChatModel.hasMany(MessageModel, {
//     as: "messages",
//     foreignKey: "chatId", 
//   })
ChatModel.belongsTo(UserModel, {
    foreignKey: 'UserId', // This is the column name that will store the foreign key value in the ChatModel
    as: 'host', // This establishes an alias for the association (optional but useful for clarity)
  })
export default ChatModel