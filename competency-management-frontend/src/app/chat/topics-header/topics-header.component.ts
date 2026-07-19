import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Topic} from "../../_model/topic.model";

@Component({
  selector: 'app-topics-header',
  templateUrl: './topics-header.component.html',
  styleUrls: ['./topics-header.component.scss']
})
export class TopicsHeaderComponent {

  @Input() topics: Topic[] = [];
  @Input() selectedTopic: Topic | undefined = undefined;
  @Output() topicSelected = new EventEmitter<Topic>();
  @Output() topicCreated = new EventEmitter();

  isDropDownOpen = false;

  onSelectTopic(topic: Topic) {
    this.topicSelected.emit(topic)
  }

  onCreateTopic() {
    this.topicCreated.emit();
  }
}
