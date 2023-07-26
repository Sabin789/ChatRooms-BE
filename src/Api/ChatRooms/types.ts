import { Model, Optional } from "sequelize";
import { MessageAttributes } from "../Messages/types";
import { UserAttributes } from "../Users/types";

interface Chat {
    name: string;
    ChatId: string;
    UserId: string;
  }

export interface ChatDoc extends Optional<Chat, 'ChatId'> {}

export interface ChatInstance extends Model<Chat>, Chat {}