using BookStore_Backend.Model.Enum;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BookStore_Backend.Model
{
    public class Order
    {
        [Key]
        public Guid Order_Id { get; set; }



        [Required(ErrorMessage = "Order date is required.")]
        public DateTime OrderDate { get; set; } = DateTime.Now;




        [Required(ErrorMessage = "Order status is required.")]
        public OrderStatus orderStatus { get; set; } = OrderStatus.Pending;



        [Required(ErrorMessage = "Total cost is required.")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Total cost must be greater than 0.")]
        public double Total_Cost { get; set; }

        public double DiscountPercentage { get; set; } = 0;

        public double GrandTotal { get; set; }


        public Guid UserId { get; set; }

        public User? User { get; set; }





    }


}
