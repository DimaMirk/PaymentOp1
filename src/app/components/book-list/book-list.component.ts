import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Book } from '../../interfaces/interfaces';
import { MatGridListModule } from '@angular/material/grid-list';
import { BookItemComponent } from '../book-item/book-item.component';
import { Observable, of, Subject } from 'rxjs';
import { BookService } from '../../services/book.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { BookDialogComponent } from '../book-dialog/book-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { debounceTime, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    BookItemComponent,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage
  ],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-20px)' }),
          stagger('100ms', [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true }),
        query(':leave', [
          animate('500ms ease-out', style({ opacity: 0, transform: 'translateY(20px)' }))
        ], { optional: true })
      ])
    ])
  ]
})
export class BookListComponent implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog);
  books$: Observable<Book[]>;
  public takeUntilSubject = new Subject<void | null>();
  public searchControl: FormControl = new FormControl();


  constructor(private bookService: BookService,  public cdr: ChangeDetectorRef) {
    this.books$ = this.bookService.getBooks();
  }

  ngOnInit(): void {
    this.books$.pipe(
      takeUntil(this.takeUntilSubject)
    ).subscribe((books) => {
      this.books$ = of(books);
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      switchMap((value: string) => this.bookService.searchBooks(value)),
      takeUntil(this.takeUntilSubject)
    ).subscribe((filteredBooks: any) => this.books$ = of(filteredBooks));
  }

  openBookDialog(book?: Book): Observable<Book | null> {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = book;
    dialogConfig.width = '600px';

    const dialogRef = this.dialog.open(BookDialogComponent, dialogConfig);
    return dialogRef.afterClosed().pipe(takeUntil(this.takeUntilSubject));
  }

  onAddClick(): void {
    this.openBookDialog().pipe(
      switchMap((newBook) => newBook ? this.bookService.addBook(newBook).pipe(takeUntil(this.takeUntilSubject)) :  of(null))
    ).subscribe((addedBook) => addedBook && (this.books$ = of(this.bookService.books)))
  }

  handleBookSelection(id: string): void {
    this.bookService.getBookById(id).pipe(
      takeUntil(this.takeUntilSubject),
      switchMap((book) => this.openBookDialog(book))
    ).subscribe((res) => {
      if (typeof res === 'string') {
        this.onDeleteItem(id);
      } else if (res) {
        this.updateBookAndRefreshList(res);
      }
    });
  }

  updateBookAndRefreshList(book: Book): void {
    this.bookService.updateBook(book).pipe(
      takeUntil(this.takeUntilSubject)
    ).subscribe((updatedBook) => updatedBook &&  (this.books$ = of(this.bookService.books)))
  }

  onDeleteItem(id: string): void {
    this.bookService.deleteBook(id).pipe(
      takeUntil(this.takeUntilSubject)
    ).subscribe(() => this.books$ = of(this.bookService.books));
  }

  ngOnDestroy(): void {
    this.takeUntilSubject.next(null);
    this.takeUntilSubject.complete();
  }
}
