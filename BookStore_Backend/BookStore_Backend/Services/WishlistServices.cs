using BookStore_Backend.DatabaseeContextt;
using BookStore_Backend.Helper.Extensions;
using BookStore_Backend.Model.Enum;
using BookStore_Backend.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using BookStore_Backend.Model.Dtos.WishListDtos;
using BookStore_Backend.Model.Dtos.BookDtos;

namespace BookStore_Backend.Services
{
    public interface IWishlistServices
    {
        Task<List<WishListDto>> GetWishLists(Guid UserID);

        Task<string?> AddWishList(AddWishlistDto dto);

        Task<string?> DeleteWishList(Guid wishListId);

    }


    public class IWishlistServicesImplementation : IWishlistServices
    {

        private readonly AppDbContext _db;
        public IWishlistServicesImplementation(AppDbContext db)
        {
            _db = db;
        }


       
        public async Task<string?> AddWishList(AddWishlistDto dto)
        {

          
                var userExist = await _db.Users.FirstOrDefaultAsync(e => e.Id == dto.UserId);
                var bookExist = await _db.Books.FirstOrDefaultAsync(e => e.Book_Id == dto.BookId);


                if (userExist == null)
                    throw new Exception("User Not Found");

                if (bookExist == null)
                    throw new Exception("Book Cannot be added to WishList");


                var checkBookAndUserWishList = await _db.WishLists.FirstOrDefaultAsync(e => e.BookId == dto.BookId && e.UserId == dto.UserId);

                if (checkBookAndUserWishList != null)
                    throw new Exception("book already exist in your Wishlist");
                

                var wishList = WishListExtensionMethod.convertAddWishListDtoToWishList(dto);
                wishList.Bookmark_Id = Guid.NewGuid();

                var result = await _db.WishLists.AddAsync(wishList);
                await _db.SaveChangesAsync();

                if (result == null) throw new Exception("Unable To Add Book In WishList");

                return "success";
  



        }

        public async Task<string?> DeleteWishList(Guid wishListId)
        {
            var checkWishList = await _db.WishLists.FirstOrDefaultAsync(e => e.Bookmark_Id == wishListId);

            if (checkWishList == null) throw new Exception($"WishList With ID : {wishListId} not found");
            
            _db.WishLists.Remove(checkWishList);
            await _db.SaveChangesAsync();

            return $"WishList Removed Successfully With Id {wishListId}";
        }

        public  async Task<List<WishListDto>> GetWishLists(Guid UserId)
        {
            var result = _db.WishLists.AsQueryable();


            return await  result.Where(e=>e.UserId==UserId).Select(e => new WishListDto()
            {
                CreatedAt = (DateTime)e.CreatedAt!,
                Book = new BookSummaryDto()
                {
                    Id=e.Book!.Book_Id,
                    Title= e.Book!.Title,
                    AuthorName =e.Book!.Author??"Author",
                    CoverImageUrl=e.Book!.CoverImage,

                },
                Bookmark_Id = e.Bookmark_Id
            }
            ).ToListAsync();
        }
    }

    }

