using BookStore_Backend.Model;
using BookStore_Backend.Model.Dtos.OrderDtos;
using System.Net;

namespace BookStore_Backend.Helper.Extensions
{
    public  static class OrderItemExtensionMethod
    {


        public static List<OrderItem>? ConvertToOrderItem(List<AddOrderItemDtos> orderItem, Guid orderId)
        {

            List<OrderItem> itemsList = new List<OrderItem>();


            foreach(var i in orderItem )
            {
                OrderItem items = new OrderItem()
                {
                    BookId = i.BookId,
                    OrderId = orderId,
                    Quantity = i.Qunatity
                };

                itemsList.Add(items);
            }



            return itemsList;


        }

    }
}
