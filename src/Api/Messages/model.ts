import sequelize from "../../db";
import { DataTypes } from "sequelize";
import {  ContentAttributes, MessageCreationAttributes, MessageInstance } from "./types";
import UserModel from "../Users/model";
import ChatModel from "../ChatRooms/model";


const MessageModel = sequelize.define<MessageInstance, MessageCreationAttributes>("message", {
    MessageId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    content: {
      type: DataTypes.JSON, // Use JSON data type to store object-like data
      allowNull: false,
      validate: {
        isObject(value: any) {
          if (typeof value !== 'object' || value === null || Array.isArray(value)) {
            throw new Error('Content must be an object');
          }
        },
        hasRequiredFields(value: ContentAttributes) {
          if (!value.text || !value.media) {
            throw new Error('Content must have text and media fields');
          }
        },
      },
    },
  }, { timestamps: true });
  


export default MessageModel;