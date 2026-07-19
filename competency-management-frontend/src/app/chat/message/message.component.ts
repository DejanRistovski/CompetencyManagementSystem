import {Component, Input} from '@angular/core';
import {ChatMessageTypeEnum} from "../../_model/enum/chat-message-type.enum";

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent {

  @Input() message: string = '';
  @Input() role: ChatMessageTypeEnum = ChatMessageTypeEnum.AI;

  roleStyleClasses: Record<ChatMessageTypeEnum, string> = {
    'USER': 'user-message',
    'AI': 'assistant-message',
    'PROCESSING': 'assistant-message'
  };
}
