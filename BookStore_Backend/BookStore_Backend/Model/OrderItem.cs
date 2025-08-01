using System.ComponentModel.DataAnnotations;

namespace BookStore_Backend.Model
{
    public class OrderItem
    {
        public Guid Id { get; set; }


        [Required(ErrorMessage = "Book ID is required.")]
        public Guid BookId {  get; set; }
        public Book? Book { get; set; }


        [Required(ErrorMessage = "Order ID is required.")]
        public Guid OrderId { get; set; }
        public Order? Order { get; set; }

        public int Quantity { get; set; }

    }
}
