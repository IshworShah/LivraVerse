using BookStore_Backend.DatabaseeContextt;
using BookStore_Backend.Model;
using BookStore_Backend.Model.Dtos.UserDtos;
using Microsoft.EntityFrameworkCore;

namespace BookStore_Backend.Helper.Extensions
{
    public static class CartExtensionMethod
    {


        public static CartItem ConvertDto(AddCartDto dtos,AppDbContext _db)
        {
            var query = _db.Books.FirstOrDefault(e => e.Book_Id == dtos.BookId);
            double unitPrice = query!.Price;
            double? discountPercent = query.DiscountPercent??0;


            return new CartItem()
            {
                BookId = dtos.BookId,
                CartId = dtos.CartId,
                Id = Guid.NewGuid(),
                Quantity = 1,
                unitPrice = _db.Books.Find(dtos.BookId)!.Price,
                discountAmount = unitPrice * (discountPercent / 100)

            };

        }



    }

}
