using BookStore_Backend.Model.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace BookStore_Backend.Model.Dtos.BookDtos
{
    public class BookDto
    {
      

        [Required(ErrorMessage = "Please Insert Book Title")]
        [MaxLength(120, ErrorMessage = "Book Title Length Exceeded")]
        public string Title { get; set; }


        [Required(ErrorMessage = "dd")]
        [DisplayName("Author Name")]
        [MaxLength(50)]
        public string Author { get; set; }



        [Required(ErrorMessage = "Please Add Book Description")]
        [MinLength(30, ErrorMessage = "Description must be at least 30 characters long.")]
        [MaxLength(1000, ErrorMessage = "Description cannot be longer than 1000 characters.")]
        public string Description { get; set; }


        [Required(ErrorMessage = "Please Enter Price of Book")]
        [Range(0, int.MaxValue, ErrorMessage = "Price Can't Be negative Value")]
        public double Price { get; set; }


        [Range(0, int.MaxValue, ErrorMessage = "Stock Quanity Can't Be negative Value")]
        public int StockQuantity { get; set; }



        public CategoryDtos BookCategoty { get; set; } = CategoryDtos.deafault;


        [DisplayName("Available in Library")]
        public bool PhysicalLibraryAvailability { get; set; }


        [Required(ErrorMessage = "Please Add Book ISBN")]
        public string ISBN { get; set; }



        [Required(ErrorMessage ="Please Choose An Language")]
        public Languages languages { get; set; }



        [Required(ErrorMessage = "Please Add Book Format")]
        [DisplayName("Book Format")]
        public Format Format { get; set; }




        [DisplayName("Book Edition")]
        public EditionType? EditionType { get; set; }


        [Range(0, 100)]
        public double? DiscountPercent { get; set; }


        [Required(ErrorMessage = "Please Add Discount Time")]
        public DateTime PublicationDate { get; set; } = DateTime.Now;

        [Display(Name = "Discount Duration")]
        public DateTime? DiscountTime { get; set; }

        [Required(ErrorMessage = "Please Select Book Genre")]
        [DisplayName("Book Genre")]
        public List<Genre> Genres { get; set; }


        // This is the optional "flag"
        [DisplayName("Is Book On Sale")]
        public bool? IsOnSale { get; set; }


        [Required(ErrorMessage ="Please Add Book Cover Image")]
        public IFormFile CoverImage { get; set; } 


    }
}
