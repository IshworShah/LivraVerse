using BookStore_Backend.Model;
using BookStore_Backend.Model.Dtos.OrderDtos;

namespace BookStore_Backend.Helper.Extensions
{
    public static class AddOrderExtensionMethod
    {

        public static Order ConvertToOrder(AddOrderDtos dtos)
        {

            var Total_Cost = dtos.Total_Cost;
            var DiscountPercentage = dtos.OrderItems!.Sum(e => e.Qunatity) >= 5 ? 5 : dtos.DiscountPercentage;

            return new Order()
            {
                OrderDate = dtos.OrderDate,
                Order_Id = Guid.NewGuid(),
                orderStatus = Model.Enum.OrderStatus.Pending,
                Total_Cost = Total_Cost,
                UserId = dtos.UserId,
                DiscountPercentage = DiscountPercentage,
                GrandTotal = Total_Cost - (Total_Cost * (DiscountPercentage / 100))

            };


        }



    }
}
