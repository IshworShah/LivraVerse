using BookStore_Backend.DatabaseeContextt;
using BookStore_Backend.Model;
using BookStore_Backend.Model.Dtos;
using BookStore_Backend.Model.Dtos.OrderDtos;
using BookStore_Backend.Model.Dtos.UserDtos;
using BookStore_Backend.Model.Enum;
using Microsoft.EntityFrameworkCore;

namespace BookStore_Backend.Helper.Extensions
{
    public static class UserExtensionMethod
    {

        public static UserProfileDtos ConvertUserToDto(User user, AppDbContext dbContext)
        {

            return new UserProfileDtos()
            {

                Username = user.Username,
                Role = user.Role,
                Email = user.Email,
                ProfileImage = user.ProfileImage,
                OrderCount = user.OrderCount,
                UserOrderHistory = dbContext.Order.Where(e=>e.UserId==user.Id && e.orderStatus == OrderStatus.Completed).Select(e => new UserOrderHistoryDto(){
                    itemList = dbContext.OrderItems.Include(e=>e.Book).Where(e => e.OrderId == e.OrderId).Select(e =>new  OrderHistoryItemListDtos(){
                        BookCoverImage=e.Book!.CoverImage,
                        BookID=e.Book.Book_Id,
                        BookTitle = e.Book.Title
                    }).ToList(),
                    orderStatus=e.orderStatus,
                    Order_Id=e.Order_Id,
                    Total_Cost=e.Total_Cost
                }).ToList(),
            };


        }


    }
}
