using BookStore_Backend.Model.Dtos.BookDtos;
using System.ComponentModel.DataAnnotations;

namespace BookStore_Backend.Model.Dtos.WishListDtos
{
    public class WishListDto
    {
        public Guid Bookmark_Id { get; set; }

        public BookSummaryDto? Book { get; set; }
       
        public DateTime CreatedAt { get; set; }
       
    }
}
