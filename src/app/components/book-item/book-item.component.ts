import { Component,ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Book } from '../../interfaces/interfaces';
import { MatDialogModule} from '@angular/material/dialog'
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatGridListModule} from '@angular/material/grid-list';


@Component({
  selector: 'app-book-item',
  standalone: true,
  imports: [MatCardModule, MatButtonModule,MatDialogModule, MatTooltipModule,MatGridListModule],
  templateUrl: './book-item.component.html',
  styleUrl: './book-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookItemComponent {

  @Input() book:Book =  {
    author: '',
    country: '',
    id: '',
    imageLink: '',
    language: '',
    title: '',
    year: 0,
};

@Output() onEdit: EventEmitter<string> = new EventEmitter<string>();


  updateBook(bookId: string){
    this.onEdit.emit(bookId); 
  }
  
}
