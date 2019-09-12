using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;
using System.Web.Http.Cors;
using WebApplication1.Models;

namespace WebApplication1.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class BookController : ApiController
    {
       
        List<Book> books = new List<Book>
        {
            new Book{ id=1,name="Android Application Development",price=29.98,rating=4,desc="A book for Android",categories=new string[]{"IT","Finance"} },
            new Book{ id=2,name="Java",price=39.98,rating=3,desc="A book for Java",categories=new string[]{"IT","Internet" } },
            new Book{ id=3,name="Life in Australia",price=24.98,rating=5,desc="A book for Australian life",categories=new string[]{"Internet" } },
            new Book{ id=4,name="Stock Investment",price=29.98,rating=3,desc="A book for investment",categories=new string[]{"IT","Finance","Internet"} },
            new Book{ id=5,name="Augular Learning",price=39.98,rating=4,desc="A book for Angular",categories=new string[]{"IT"} },
            new Book{ id=6,name="ASP.NET MVC",price=19.98,rating=1,desc="A book for ASP.NET MVC",categories=new string[]{"IT","Internet" } },
            new Book{ id=7,name="Think",price=59.98,rating=3,desc="A book for Philosophy",categories=new string[]{"Finance"} },
            new Book{ id=8,name="Front-end Development",price=33.98,rating=5,desc="A book for front-end programming",categories=new string[]{"IT","Finance" } }
        };

        private static object locker = new object();//用于避免多个客户端连接发生冲突
        private static readonly List<StreamWriter> Subscriber = new List<StreamWriter>();
        //server sent event
        [Route("api/sse")]
        [HttpGet]
        public HttpResponseMessage Get(HttpRequestMessage request)
        {
            var response = new HttpResponseMessage(){
                Content = new PushStreamContent(async (stream, content, context) => {

                    var subscriber = new StreamWriter(stream) { AutoFlush = true };
   
                    lock (locker){ Subscriber.Add(subscriber); }

                    int i = 0;
                    while (true){
                        i++;
                        Thread.Sleep(3000);
                        await subscriber.WriteLineAsync("data: " + i.ToString() + "\n");
                    }

                }, "text/event-stream")
            };
            return response;
        }

        //get all books
        [Route("api/books")]
        [HttpGet]
        public IEnumerable<Book> GetBooks()
        {
            return books;
        }

        //get book through id
        [Route("api/book/{id}")]
        [HttpGet]
        public Book GetBook(int id)
        {
            return books.Find(book => book.id == id);
        }

        //search books through keywords
        [Route("api/books/{name}")]
        [HttpGet]
        public IEnumerable<Book> GetBooksByName(string name)
        {
            List<Book> searchBooks = new List<Book> { };
            books.ForEach(book =>
            {
                if (book.name.ToLower().Contains(name.ToLower()))
                {
                    searchBooks.Add(book);
                }
            });
            return searchBooks;
        }
        //create new book
        [Route("api/book/create")]
        [HttpPost]
        public Book CreateBook(Book book)
        {
            books.Add(book);
            return book;
        }
        //update book
        [Route("api/book/update")]
        [HttpPost]
        public List<Book> UpdateBook(Book editedBook)
        {
            var s = books.Find(book => book.id == editedBook.id);
            int index = books.IndexOf(s);
            books[index] = editedBook;
            //UPDATE after having created database
            return books;
        }
        //genId
        [Route("api/book/genId")]
        [HttpGet]
        public int GenId()
        {            
            return books.Count > 0 ? books.OrderByDescending(book=>book.id).First().id + 1 : 1;
        }
    }
}
