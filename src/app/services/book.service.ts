import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Book } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BookService {

 books:Book[] = [
    {
      title: "Things Fall Apart 1",
      author: "Chinua Achebe",
      year: 1958,
      language: "English",
      country: "Nigeria",
      imageLink: "https://img.freepik.com/free-photo/open-book-with-white-background_23-2148882765.jpg?size=626&ext=jpg",
      id: "001"
    },
    {
      title: "Fairy tales 1",
      author: "Hans Christian Andersen",
      year: 1836,
      language: "Danish",
      country: "Denmark ",
      imageLink: "https://img.freepik.com/free-photo/open-book-with-white-background_23-2148882765.jpg?size=626&ext=jpg",
      id: "002"
    },
    {
      id: "003",
      author: "Dante Alighieri",
      country: "Italy",
      imageLink: "https://img.freepik.com/free-photo/open-book-with-white-background_23-2148882765.jpg?size=626&ext=jpg",
      language: "Italian",
      title: "The Divine Comedy",
      year: 1315
    },
    {
      id: "004",
      author: "Unknown",
      country: "Akkadian Empire",
      imageLink: "https://img.freepik.com/free-photo/open-book-with-white-background_23-2148882765.jpg?size=626&ext=jpg",
      language: "Akkadian",
      title: "The Epic Of Gilgamesh",
      year: -1700
    },
    {
      id: "005",
      author: "Unknown",
      country: "Achaemenid Empire",
      imageLink: "https://img.freepik.com/free-photo/open-book-with-white-background_23-2148882765.jpg?size=626&ext=jpg",
      language: "Hebrew",
      title: "The Book Of Job",
      year: -600
    },
    {
      id: "006",
      author: "Unknown",
      title: "One Thousand and One Nights",

      year: 1200,
      language: "Arabic",
      country: "India",
      imageLink: "https://img.freepik.com/free-photo/open-book-with-white-background_23-2148882765.jpg?size=626&ext=jpg",
    },
    {
      id: "007",
      author: "Unknown",
      country: "Iceland",
      imageLink: "https://img.freepik.com/free-photo/open-book-with-white-background_23-2148882765.jpg?size=626&ext=jpg",
      language: "Old Norse",
      title: "Njál's Saga",
      year: 1350
    },
    {
      id: "008",
      author: "Jane Austen",
      country: "United Kingdom",
      imageLink: "https://img.freepik.com/free-photo/open-book-with-white-background_23-2148882765.jpg?size=626&ext=jpg",
      language: "English",
      title: "Pride and Prejudice",
      year: 1813
    }
  ]

  getBooks(): Observable<Book[]> {
    return of(this.books);
  }

  getBookById(id: string): Observable<Book | undefined> {
    const book = this.books.find(book => book.id === id);
    return of(book);
  }

  addBook(book: Book): Observable<Book> {
    this.books.push(book);
    return of(book);
  }

  updateBook(book: Book): Observable<Book | undefined> {
    const index = this.books.findIndex(b => b.id === book.id);
    if (index !== -1) {
      this.books[index] = book;
      return of(book);
    }
    return of(undefined);
  }

  deleteBook(id: string): Observable<Book | undefined> {
    this.books = this.books.filter(book => book.id !== id);
    return of(this.books.find(book => book.id == id));
  }

  searchBooks(query: string): Observable<Book[]> {
    if (!query) {
      return of(this.books);
    }
    const filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase())
    );
    return of(filteredBooks);
  }

}
