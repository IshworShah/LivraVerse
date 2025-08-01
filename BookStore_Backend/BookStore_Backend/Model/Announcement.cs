using System.ComponentModel.DataAnnotations;

namespace BookStore_Backend.Model
{
    public class Announcement
    {
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Please enter the title of the announcement.")]
        public string? Title { get; set; }

        [Required(ErrorMessage = "Please enter the message content.")]
        public string? Messsage { get; set; }

        [Required(ErrorMessage = "Please specify the start date of the announcement.")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "Please specify the end date of the announcement.")]
        public DateTime EndDate { get; set; }

        public bool isActive => DateTime.Now > StartDate && DateTime.Now < EndDate;

        public ICollection<Book>? Books { get; set; }

    }
}
