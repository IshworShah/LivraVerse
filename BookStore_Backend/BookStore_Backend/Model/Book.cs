using BookStore_Backend.Model.Dtos.BookDtos;
using BookStore_Backend.Model.Enum;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace BookStore_Backend.Model
{
    public class Book
    {
        [Key]
        public Guid Book_Id { get; set; }

        [Required(ErrorMessage = "Please Insert Book Title")]
        [MaxLength(120,ErrorMessage ="Book Title Length Exceeded")]
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


        [Range(0,int.MaxValue,ErrorMessage ="Stock Quanity Can't Be negative Value")]
        public int StockQuantity {  get; set; }



        [DisplayName("Available in Library")]
        public bool PhysicalLibraryAvailability { get; set; }


        [Required(ErrorMessage ="Please Add Book ISBN")]
        public string ISBN { get; set; }

        public bool DeleteStatus { get; set; } = false;


        [Required(ErrorMessage ="Please Add Book Format")]
        [DisplayName("Book Format")]
        public Format Format { get; set; }

        [DisplayName("Book Edition")]
        public EditionType? EditionType { get; set; }

     
        [Range(0,100)]
        public Double? DiscountPercent { get; set; }


        [Required(ErrorMessage ="Please Add Discount Time")]
        public DateTime PublicationDate { get; set; }

        [Display(Name = "Discount Duration")]
        public DateTime? DiscountTime { get; set; }

        [Required(ErrorMessage ="Please Select Book Genre")]
        [DisplayName("Book Genre")]
        public List<Genre>? Genres { get; set; }

        // This is the optional "flag"
        [DisplayName("Is Book On Sale")]
        public bool? IsOnSale { get; set; }

        [Required(ErrorMessage = "Please Choose An Language")]
        public Languages languages { get; set; }

        [Required(ErrorMessage = "Please Add Book CoverImage")]

        public string CoverImage { get; set; } = String.Empty;


        [Required(ErrorMessage ="Please choose Book Category")]
        public CategoryDtos Bookcategory { get; set; }


        public ICollection<Review>? Reviews { get; set; }

        public Guid? AnnouncementId { get; set; }
        public Announcement? Announcement { get; set; }

        public Book UserConverted (BookDto bookDto)
        {
            return new Book
            {
                Book_Id = Guid.NewGuid(),
                ISBN = bookDto.ISBN,
                Title = bookDto.Title,
                PhysicalLibraryAvailability = bookDto.PhysicalLibraryAvailability,
                StockQuantity = bookDto.StockQuantity,
                Author = bookDto.Author,
                Description = bookDto.Description,
                DiscountTime = bookDto.DiscountTime,
                Format = bookDto.Format,
                Genres = bookDto.Genres,
                DiscountPercent = bookDto.DiscountPercent,
                EditionType = bookDto.EditionType,
                IsOnSale = bookDto.IsOnSale,
                Price = bookDto.Price,
                PublicationDate = bookDto.PublicationDate,
                languages=bookDto.languages


            };


        }




    }
}
