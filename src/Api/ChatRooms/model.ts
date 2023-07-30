import sequelize from "../../db";
import { DataTypes } from "sequelize";
import { ChatDoc, ChatInstance } from "./types";

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
      },
      limit:{
        type: DataTypes.INTEGER,
        allowNull: false
      },
     members:{
        type:DataTypes.ARRAY(DataTypes.STRING)
     }
  })




export default ChatModel