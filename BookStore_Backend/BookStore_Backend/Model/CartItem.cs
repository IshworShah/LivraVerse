using System.ComponentModel.DataAnnotations;

namespace BookStore_Backend.Model
{
    public class CartItem
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Book ID is required.")]
        public Guid BookId { get; set; }

        public Book? Book { get; set; }



        [Required(ErrorMessage = "Cart ID is required.")]
        public Guid CartId { get; set; }
        public Cart? Cart { get; set; } 


        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be at least 1.")]
        public int Quantity { get; set; }

        public double unitPrice { get; set; }   

        public double? discountAmount { get; set; }


    }
}
