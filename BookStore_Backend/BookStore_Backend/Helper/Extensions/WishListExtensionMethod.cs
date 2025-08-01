using BookStore_Backend.Model;
using BookStore_Backend.Model.Dtos.WishListDtos;

namespace BookStore_Backend.Helper.Extensions
{
    public static class WishListExtensionMethod
    {

        public static WishList convertAddWishListDtoToWishList(AddWishlistDto addWishlistDto)
        {

            return new WishList()
            {
                CreatedAt = addWishlistDto.CreatedAt,
                BookId = addWishlistDto.BookId,
                UserId = addWishlistDto.UserId
            };



        }

    }
}
