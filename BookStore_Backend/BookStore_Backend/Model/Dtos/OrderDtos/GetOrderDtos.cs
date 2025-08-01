using BookStore_Backend.Model.Enum;
using System.ComponentModel.DataAnnotations;

namespace BookStore_Backend.Model.Dtos.OrderDtos
{
    public class GetOrderDtos
    {

        public Guid Order_Id { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;

        public List<OrderItemDtos>? itemDtos { get; set; }


        public OrderStatus orderStatus { get; set; } = OrderStatus.Pending;

        public double Total_Cost { get; set; }


        public OrderUserDtos? User { get; set; }



    }
}
