import { Model, Optional } from "sequelize";
import { MessageAttributes, MessageInstance } from "../Messages/types";
import { UserAttributes, UserInstance } from "../Users/types";

interface Chat {
    name: string;
    ChatId: string;
    UserId: string;
    limit:number;
    members:string[]
    // messages: MessageInstance[]
  }

export interface ChatDoc extends Optional<Chat, 'ChatId'> {}

export interface ChatInstance extends Model<Chat>, Chat {}