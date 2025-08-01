using System.ComponentModel.DataAnnotations;

namespace BookStore_Backend.Model
{
    public class WishList
    {
        [Key]
        public Guid Bookmark_Id {  get; set; }


        [Required(ErrorMessage = "Book_Id is required.")]
        public Guid BookId { get; set; }

        public Book? Book { get; set; }

        [Required(ErrorMessage = "User_Id is required.")]
        public Guid UserId { get; set; }

        public User? User { get; set; }

        public DateTime? CreatedAt { get; set; }

    }
}
