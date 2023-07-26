import { Model, Optional } from "sequelize";
import { UserAttributes } from "../Users/types";

export interface ContentAttributes {
    text: string;
    media: string;
  }
  
  export interface MessageAttributes {
    MessageId: string;
    content: ContentAttributes;
  }

  export interface MessageCreationAttributes extends Optional<MessageAttributes, 'MessageId'> {}

  export interface MessageInstance extends Model<MessageAttributes, MessageCreationAttributes>, MessageAttributes {}