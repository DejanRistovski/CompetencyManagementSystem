import {ChatMessageTypeEnum} from "./enum/chat-message-type.enum";

export interface Message {
  text: string,
  type: ChatMessageTypeEnum
}
