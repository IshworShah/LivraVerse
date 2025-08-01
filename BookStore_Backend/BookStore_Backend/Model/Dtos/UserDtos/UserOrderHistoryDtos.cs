using BookStore_Backend.Model.Dtos.OrderDtos;
using BookStore_Backend.Model.Enum;

namespace BookStore_Backend.Model.Dtos.UserDtos
{
    public class UserOrderHistoryDto
    {

        public Guid Order_Id { get; set; }

        public OrderStatus orderStatus { get; set; } = OrderStatus.Pending;


        public IList<OrderHistoryItemListDtos> itemList = [];

        public double Total_Cost { get; set; }

    }
}
