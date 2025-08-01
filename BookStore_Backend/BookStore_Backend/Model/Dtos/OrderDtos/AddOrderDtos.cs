using BookStore_Backend.Model.Enum;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BookStore_Backend.Model.Dtos.OrderDtos
{
    public class AddOrderDtos
    {
     
        public DateTime OrderDate { get; set; } = DateTime.Now;

        public double Total_Cost { get; set; }

        public Guid UserId { get; set; }
        public ICollection<AddOrderItemDtos>? OrderItems { get; set; }

        public double DiscountPercentage { get; set; } = 0;

       






    }
}
