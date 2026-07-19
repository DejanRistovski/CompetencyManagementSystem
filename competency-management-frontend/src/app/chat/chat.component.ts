import {Component, OnInit} from '@angular/core';
import {ChatService} from "../_services/chat.service";
import {Message} from "../_model/message.model";
import {TopicService} from "../_services/topic.service";
import {EMPTY, Observable} from "rxjs";
import {Topic} from "../_model/topic.model";
import {ChatMessageTypeEnum} from "../_model/enum/chat-message-type.enum";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  message: string = '';
  selectedTopic: Topic | undefined = undefined;

  topics: Observable<Topic[]> = EMPTY;

  protected readonly ChatMessageTypeEnum = ChatMessageTypeEnum;

  constructor(private chatService: ChatService,
              private topicService: TopicService) {
  }

  ngOnInit(): void {
    this.topics = this.topicService.getTopics();
  }

  chatStream(msg: Message) {
    if (this.selectedTopic !== undefined) {
      let hasProcessingMessage = true;
      const processingMsg: Message = {
        text: 'Thinking...',
        type: ChatMessageTypeEnum.PROCESSING
      };

      this.addMessage(processingMsg);
      this.chatService.chat(this.selectedTopic.id ?? null, msg).subscribe(
        value => {
          if (hasProcessingMessage) {
            this.removeProcessingMessage();
            hasProcessingMessage = false;
          }
          this.message += value;
        },
        undefined,
        () => {
          const msg: Message = {
            text: this.message,
            type: ChatMessageTypeEnum.AI
          };

          this.addMessage(msg);
          this.message = ''

          if (this.selectedTopic?.id === undefined) {
            this.topicService.createTopic(this.selectedTopic!).subscribe(topic => this.onSelectTopic(topic));
            this.topicService.getTopics();
          }
        });
    }
  }

  onTextInput(text: string) {
    const msg: Message = {
      text: text,
      type: ChatMessageTypeEnum.USER
    };

    this.addMessage(msg);
    this.chatStream(msg);
  }

  onSelectTopic(topic: Topic) {
    this.selectedTopic = topic;
    this.topicService.watchTopic(topic.id!).subscribe(t => this.selectedTopic = t);
  }

  onCreateTopic() {
    this.selectedTopic = undefined;
  }

  private addMessage(msg: Message) {
    if (this.selectedTopic === undefined) {
      this.selectedTopic = {messages: [msg]}
    } else {
      this.selectedTopic = {
        ...this.selectedTopic,
        messages: [...this.selectedTopic.messages ?? [], msg]
      }
    }
  }

  private removeProcessingMessage() {
    if (this.selectedTopic !== undefined && this.selectedTopic.messages !== undefined) {
      this.selectedTopic.messages = this.selectedTopic.messages.filter(msg => msg.type !== ChatMessageTypeEnum.PROCESSING);
    }
  }
}
