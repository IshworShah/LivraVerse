using BookStore_Backend.DatabaseeContextt;
using BookStore_Backend.Model;
using BookStore_Backend.Model.Dtos;
using BookStore_Backend.Model.Dtos.OrderDtos;
using Microsoft.EntityFrameworkCore;

namespace BookStore_Backend.Helper.Extensions
{
    public static class OrderExtensionMethod
    {
        public static GetOrderDtos ConvertDtos(Order order,AppDbContext db)
        {


            var orderItem = db.OrderItems.Where(e=>e.OrderId==order.Order_Id).Include(e => e.Book).Select(e => new OrderItemDtos()
            {
              BookId=e.BookId,
              BookTitle=e.Book!.Title,
              Price=e.Book.Price,
              BookCover=e.Book.CoverImage,
              Quantity=e.Quantity,

            }).ToList();





            return new GetOrderDtos()
            {


                Total_Cost = order.Total_Cost,
                OrderDate = order.OrderDate,
                orderStatus = order.orderStatus,
                Order_Id = order.Order_Id,
                itemDtos =orderItem,
                User = new OrderUserDtos(){
                    ProfileImage=order.User!.ProfileImage,
                    UserID=order.User.Id,
                    UserName=order.User.Username
                }

                

            };



        }


    }
}
