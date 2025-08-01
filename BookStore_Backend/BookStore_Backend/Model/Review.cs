using System.ComponentModel.DataAnnotations;

namespace BookStore_Backend.Model
{
    public class Review
    {
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage ="Please Add Review Text")]
        public string Text { get; set; }



        [Required(ErrorMessage ="Pease add purchase Rating")]
        [Range(1,5,ErrorMessage ="Rating is of Range 1 => :(  to 5 => :)")]
        public Double Ratings { get; set; }



        [Required(ErrorMessage ="UserId Is Required For Adding Reviews")]
        public Guid UserId  { get; set; }

        public User? User { get; set; }



        [Required(ErrorMessage = "BookId  Is Required For Adding Reviews")]
        public Guid BookId { get; set; }
        public Book? Book { get; set; }
    }
}
 