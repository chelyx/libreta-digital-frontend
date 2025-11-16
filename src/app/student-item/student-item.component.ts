import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/core/models/user';

@Component({
  selector: 'app-student-item',
  templateUrl: './student-item.component.html',
  styleUrls: ['./student-item.component.scss']
})
export class StudentItemComponent {
 @Input() student: User = {} as User;
@Input() highlight = false;
@Input() status: 'valid' | 'absent' | 'invalid' = 'valid';
@Output() removeClick = new EventEmitter();

}
