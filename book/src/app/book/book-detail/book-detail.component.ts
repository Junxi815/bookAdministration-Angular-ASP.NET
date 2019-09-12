import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from 'src/app/shared/Book';
import { Location } from '@angular/common';
import { BookService } from 'src/app/shared/book.service';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { minSelectedCheckboxes } from 'src/app/Validators/Validators';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  book: Book;
  id:number;
  oldRating:number;
  editBookForm:FormGroup;
  bookType:string[] = ["IT","Finance","Internet"];
  
  constructor(
    private bookService: BookService,
    private routeInfo: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder){}

  ngOnInit() {
    this.getSelectedBook();
    this.oldRating=this.book.rating;
    //create form module
    this.editBookForm = this.fb.group({
      bookName:[this.book.name,[Validators.required,Validators.minLength(3)]],
      bookPrice:[this.book.price,Validators.required],
      bookDesc:[this.book.desc],
      categories:this.fb.array([],minSelectedCheckboxes(1))
    });
    this.addCategory(this.bookType);
  }

  //add FormArray checkbox with FormControl according to bookType's values
  //here formControl's value is true or false
  addCategory(bookType:string[]):void{
    this.bookType.map(v=>{
      let control = new FormControl(this.book.categories.indexOf(v)>-1);
      (this.editBookForm.controls.categories as FormArray).push(control);
    })
  }

  //get selected book through route id 
  getSelectedBook(): void{
    // this.id = +this.routeInfo.snapshot.paramMap.get('id');
    this.id = +this.routeInfo.snapshot.params.id;
    if(this.id>=1){
      this.bookService.findBook(this.id).subscribe(book=>this.book=book);
    }
    if(this.id==0){
      let newId = this.bookService.genId(); 
      this.book = new Book(newId,'',null,0,'',[]);
      // this.book = new Book(9,'',null,0,'',[]);
    }
   
  }

  goBack(): void {
    //if click button 'cancel', should restore its rating value to original one.
    this.book.rating = this.oldRating;
    this.location.back();
  }

  submit(editBookForm:FormGroup){
    //get an array of categories selected.
    let categorySelected = [];
    // for(let i=0;i<this.bookType.length;i++){
    //   if(editBookForm.value.categories[i]){
    //     categorySelected.push(this.bookType[i]);
    //   }
    // }
    categorySelected = this.editBookForm.value.categories
      .map((v,i)=>v?this.bookType[i]:null).filter(v=>v!==null);

    let editedBook = new Book(
      this.book.id,
      editBookForm.value.bookName,
      editBookForm.value.bookPrice,
      this.book.rating,
      editBookForm.value.desc,
      categorySelected
    );
    //check book is existing or not by book's id, and then decide which method to be executed.

    if(this.bookService.books.find(book=>this.book.id==book.id)){
      this.bookService.updateBook(editedBook);
    }else{
      this.bookService.addBook(editedBook).subscribe(book=>console.log(book));
      console.log(111)
    }  
    this.location.back();
  }
 
  changeRartingHandler(newRating:number){
    this.book.rating = newRating;
  }
}
