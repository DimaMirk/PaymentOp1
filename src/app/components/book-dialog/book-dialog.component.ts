import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import { Book } from '../../interfaces/interfaces';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-book-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormFieldModule, MatInputModule,ReactiveFormsModule,MatGridListModule,MatIconModule],
  templateUrl: './book-dialog.component.html',
  styleUrl: './book-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDialogComponent implements OnInit {
  public book:Book = {
    author: '',
    country: '',
    id: '',
    imageLink: '',
    language: '',
    title: '',
    year: 0,
  }

  public bookForm!: UntypedFormGroup;
  public img = ''


  constructor(
    private dialogRef: MatDialogRef<BookDialogComponent>,
    public formBuilder: UntypedFormBuilder,
    public cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) book:Book){
      this.book = book
     }
  
  ngOnInit(){
    console.log(this.book)
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      year: [0, Validators.required],
      language: ['', Validators.required],
      country: ['', Validators.required],
      imageLink:['', Validators.required]
    })
    
    if(this.book){
      this.setFormValue(this.book)
    }
  }

  setFormValue(book:Book){
    this.img = book.imageLink;
    this.bookForm.setValue({
      title: book.title,
      author: book.author,
      year: book.year,
      language: book.language,
      country: book.country,
      imageLink:book.imageLink
    })
  }

  onSaveClick() {
    let params =  this.bookForm.value
    if(this.book){
      params.id = this.book.id
    }

    if(this.bookForm.valid){
      this.dialogRef.close(params);
    }
  }

  onDeletImgClick(){
    this.img = ''
    this.bookForm.get('imageLink')?.setValue('');
  }
  
  onDeleteClick(){
    if(this.bookForm.valid){
      this.dialogRef.close('delete');
    }
  }

  onCanselClick(){
    this.dialogRef.close(false);
  }

  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
  
      reader.onload = () => {
        const imageUrl = reader.result as string;
        this.bookForm.get('imageLink')?.setValue(imageUrl);
        this.img = imageUrl
        this.cdr.markForCheck();
      };
  
      reader.readAsDataURL(file);
    }
  }
  
  

}
