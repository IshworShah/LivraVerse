using BookStore_Backend.Model.Dtos.UserDtos;
using System.ComponentModel.DataAnnotations;

namespace BookStore_Backend.Model
{
 
        public class User
        {
            [Key]
            public Guid Id { get; set; }

            [Required(ErrorMessage ="Username is Required")]
            [StringLength(50)]
            public string Username { get; set; } = string.Empty;



            [Required(ErrorMessage ="Please Enter Email address")]
            [EmailAddress]
            public string Email { get; set; } = string.Empty;



            [Required(ErrorMessage ="Password Is Required")]
            public string PasswordHash { get; set; } = string.Empty;

            public string Role { get; set; } = "User"; // Default role is User

            public string ProfileImage { get; set; } = String.Empty;

            public int OrderCount { get; set; } = 0;

            // Navigation property for reviews
            public ICollection<Review>? Reviews { get; set; }

           public ICollection<WishList> WishLists { get; set; }

           public Guid CartId { get; set; }
           public Cart Cart { get; set; }

           public ICollection<Order>? Orders { get; set; }
        public User ConvertUserFormDto(UserDto userDto)
        {

            return new User()
            {
                Id = Guid.NewGuid(),
                 Email = userDto.Email,
                 Username = userDto.Username,   
                 PasswordHash = userDto.PasswordHash,
               
            };

        }



        }


    
}
