using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace BookStore_Backend.Model.Dtos.UserDtos
{
    public class UserDto
    {
    
        [Required(ErrorMessage = "Username is Required")]
        [StringLength(50)]
        public string Username { get; set; } = string.Empty;



        [Required(ErrorMessage = 
"Please Enter Email address")]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;


        [DisplayName("Password")]
        [Required(ErrorMessage = "Password Is Required")]
        public string PasswordHash { get; set; } = string.Empty;

    }
}
