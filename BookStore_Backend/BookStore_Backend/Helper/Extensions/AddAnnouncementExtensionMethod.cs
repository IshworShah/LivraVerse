using BookStore_Backend.Model;
using BookStore_Backend.Model.Dtos.AnnouncementDtos;

namespace BookStore_Backend.Helper.Extensions
{
    public static class AddAnnouncementExtensionMethod
    {
    
        
        public static Announcement ConvertAnnouncementDtos(AddAnnouncementDtos announcementDtos)
        {

            return new Announcement()
            {
                Id = Guid.NewGuid(),
                StartDate = announcementDtos.StartDate,
                EndDate = announcementDtos.StartDate,
                Messsage=announcementDtos.Messsage,
                Title=announcementDtos.Title,
                
            };



        }
       




















    }

}
