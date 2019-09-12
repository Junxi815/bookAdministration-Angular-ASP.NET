import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/shared/Book';
import { BookService } from 'src/app/shared/book.service';
import { FormControl } from '@angular/forms';
import 'rxjs/Rx';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  private books:Array<Book>;
  searchInput: FormControl = new FormControl();

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.bookService.getBooks().subscribe(books=>this.books=books);

    this.searchInput.valueChanges
    .debounceTime(500)
    .subscribe(
      bookName=>{
        if(!!bookName.trim()){
          this.bookService.searchBooks(bookName.trim()).subscribe(books=>this.books=books);
        }
      },
      err=>console.error(err),
      ()=>console.log("search finished!")
    )
  }
}


