using System.ComponentModel.DataAnnotations;

namespace BookStore_Backend.Model.Dtos.AnnouncementDtos
{
    public class AddAnnouncementDtos
    {
        public string Title { get; set; }
            
        [Required(ErrorMessage = "Please enter the message content.")]
        public string Messsage { get; set; }

        [Required(ErrorMessage = "Please specify the start date of the announcement.")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "Please specify the end date of the announcement.")]
        public DateTime EndDate { get; set; }

        public List<Guid>? BookDtos { get; set; }

        public bool isActive => DateTime.Now > StartDate && DateTime.Now < EndDate;
    }
}
