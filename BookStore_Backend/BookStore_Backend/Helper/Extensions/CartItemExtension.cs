using BookStore_Backend.DatabaseeContextt;
using BookStore_Backend.Model.Dtos;
using BookStore_Backend.Model.Enum;
using BookStore_Backend.Model;
using Microsoft.EntityFrameworkCore;
using BookStore_Backend.Model.Dtos.CartDtos;
using BookStore_Backend.Model.Dtos.BookDtos;

namespace BookStore_Backend.Helper.Extensions
{
    public static class CartItemExtension
    {

        public static CartItemDtos ConvertCartToDto(Guid itemId, AppDbContext dbContext)
        {

            var item = dbContext.CartItems.Include(e => e.Book).FirstOrDefault(e => e.Id == itemId);

            return new CartItemDtos()
            {
                Book = new BookSummaryDto()
                {
                    AuthorName=item!.Book!.Author,
                    CoverImageUrl=item.Book.CoverImage,
                    Id=item.Book.Book_Id,
                    Title=item.Book.Title,
                },
                Quantity=dbContext.CartItems.FirstOrDefault(e=>e.Id==itemId)!.Quantity,
                Id=itemId,
                unitPrice= dbContext.CartItems.FirstOrDefault(e => e.Id == itemId)!.unitPrice

            };

        }

    }
}
