using BookStore_Backend.Model;
using BookStore_Backend.Model.Dtos.AnnouncementDtos;

namespace BookStore_Backend.Helper.Extensions
{
    public static class AnnoucementExtensionMethod
    {

        public static GetAnnouncementDtos ConvertToDto(Announcement announcement)
        {
            return new GetAnnouncementDtos()
            {
                Id = announcement.Id,
                EndDate = announcement.EndDate,
                Messsage = announcement.Messsage,
                StartDate = announcement.StartDate,
                Title = announcement.Title,
                Books = announcement.Books
            };

        }







    }
}
