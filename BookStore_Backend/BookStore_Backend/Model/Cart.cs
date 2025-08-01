using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BookStore_Backend.Model
{
    public class Cart
    {
        [Key]
        public Guid Id { get; set; }


        public User? User { get; set; }  


        public List<CartItem>? Items { get; set; }
 

        [Range(0, 100, ErrorMessage = "Please insert discount percentage in the range 0 to 100%.")]
        public double DiscountPercentage { get; set; }

         

        [Range(0, double.MaxValue, ErrorMessage = "Total price cant bee negative.")]
        public double TotalPrice { get; set; } = 0;

        public double DiscountedPrice { get; set; }
    }
}
