using System.ComponentModel.DataAnnotations;

namespace BookStore_Backend.Model.Dtos.WishListDtos
{
    public class AddWishlistDto
    {
    

        [Required(ErrorMessage = "Book_Id is required.")]
        public Guid BookId { get; set; }

      
        [Required(ErrorMessage = "User_Id is required.")]
        public Guid UserId { get; set; }

   
        public DateTime? CreatedAt { get; set; }


        


    }
}
