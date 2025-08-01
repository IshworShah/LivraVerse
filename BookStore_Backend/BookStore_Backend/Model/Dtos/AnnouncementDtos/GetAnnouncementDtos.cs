using System.ComponentModel.DataAnnotations;

namespace BookStore_Backend.Model.Dtos.AnnouncementDtos
{
    public class GetAnnouncementDtos
    {
        public Guid Id { get; set; }

       
        public string? Title { get; set; }

        public string? Messsage { get; set; }

      
        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public ICollection<Book>? Books { get; set; }





    }
}
