using System.ComponentModel.DataAnnotations;

namespace BookStore_Backend.Model.Dtos.UserDtos
{
    public class UserProfileDtos
    {
  

        public string Username { get; set; } = string.Empty;

    
        public string Email { get; set; } = string.Empty;

        public string Role { get; set; } = string.Empty;

        public string ProfileImage { get; set; } = string.Empty;

        public int OrderCount { get; set; } = 0;

        //// Navigation property for reviews
        /// <summary>
        /// 
        /// </summary>
        /// 

        public ICollection<UserOrderHistoryDto>? UserOrderHistory { get; set; }
        //public ICollection<WishListDto>? WishLists { get; set; }
    }
}
