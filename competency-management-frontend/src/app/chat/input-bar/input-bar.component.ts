import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";

@Component({
  selector: 'app-input-bar',
  templateUrl: './input-bar.component.html',
  styleUrls: ['./input-bar.component.scss']
})
export class InputBarComponent implements OnInit {

  @Input() isTopicSelected = false;
  @Output() onTextEntered = new EventEmitter<string>();

  textInputFC: FormControl<string>;

  constructor(private formBuilder: FormBuilder) {
    this.textInputFC = this.formBuilder.control('', {nonNullable: true});
  }

  ngOnInit(): void {
  }

  textEntered() {
    this.onTextEntered.emit(this.textInputFC.value);
    this.textInputFC.reset();
  }
}
