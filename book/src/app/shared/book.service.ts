import { Injectable } from '@angular/core';
import { Book } from './Book';
import { BOOKS } from './mock-books';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class BookService{
  baseUrl:string = "http://10.1.1.11:3000/api/" //changing according to server's url and port
  books:Book[];
  constructor(public http:HttpClient) {
    this.getBooks().subscribe(books=>this.books=books);
  }

  getBooks():Observable<Book[]>{
    return this.http.get<Book[]>(this.baseUrl+"books");
  }
  findBook(id:number):Observable<Book>{
    // this.http.get(this.baseUrl+"book/"+id).subscribe(v=>console.log(v));
    // return this.http.get(this.baseUrl+"book/"+id);
    return Observable.of(this.books.find(book=>book.id==id));
  }
  updateBook(editedBook:Book):Observable<Book[]>{
    return this.http.post<Book[]>(this.baseUrl+"book/update",editedBook);
    // let book = BOOKS.find(book=>book.id==editedBook.id);
    // Object.assign(book,editedBook);
  }
  addBook(book:Book){
    return this.http.post(this.baseUrl+"book/create",book);
    
    // BOOKS.push(book);
  }

  //search books by keyword of book name
  searchBooks(bookName:string):Observable<Book[]>{
    return this.http.get<Book[]>(this.baseUrl+"books/"+bookName);
    // if(!bookName.trim()){
    //   return BOOKS;
    // }
    // let item = bookName.trim().toLowerCase();
    // return BOOKS.filter(book=>book.name.toLowerCase().indexOf(item)>-1);
  }

  //generate a new id which is self-increment based on the maximum existing id value
  genId(): number {
    // return this.http.get(this.baseUrl+"book/genId");
    return this.books.length > 0 ? Math.max(...this.books.map(book => book.id)) + 1 : 1;
  }
}
