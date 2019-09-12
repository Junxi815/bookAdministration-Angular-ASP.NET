using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication1.Models
{
    public class Book
    {
        public int id { get; set; }
        public string name { get; set; }
        public double price { get; set; }
        public int rating { get; set; }
        public string desc { get; set; }
        public IEnumerable<string> categories { get; set; }
    }
}