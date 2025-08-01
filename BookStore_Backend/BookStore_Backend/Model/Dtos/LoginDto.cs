using System.ComponentModel.DataAnnotations;

namespace BookStore_Backend.Model.Dtos
{
    public class LoginDto
    {


        [Required(ErrorMessage ="Email Address Is Required")]
        [EmailAddress(ErrorMessage ="Please Use Correct Email Address")]
        public string Email { get; set; }   
        [Required(ErrorMessage ="Please Enter Your Password")]
        public string Password { get; set; }

    }
}
