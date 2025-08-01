using BookStore_Backend.DatabaseeContextt;
using BookStore_Backend.Helper.Extensions;
using BookStore_Backend.Model;
using BookStore_Backend.Model.Dtos.AnnouncementDtos;
using Microsoft.EntityFrameworkCore;

namespace BookStore_Backend.Services
{
    public interface IAnnouncementService
    {
        Task<String?>  AddAnnoucement(List<Book> Books, AddAnnouncementDtos addAnnouncementDtos);
        Task<List<GetAnnouncementDtos>?> GetAnnouncements(); 
    }

    public class IAnnouncementServiceImplementation : IAnnouncementService
    {

        private readonly AppDbContext _db;

        public IAnnouncementServiceImplementation(AppDbContext dbContext)
        {
            _db = dbContext;
        }


        public async Task<string?> AddAnnoucement(List<Book> Books,AddAnnouncementDtos dtos)
        {

            var Announcement = AddAnnouncementExtensionMethod.ConvertAnnouncementDtos(dtos);

            if (Announcement == null)
            {
                return null;
            }

          await  _db.Announcements.AddAsync(Announcement);
          
            foreach(var book in Books)
            {
                book.AnnouncementId = Announcement.Id;
            }

            await _db.SaveChangesAsync();

            return "Annoucement Created Sucessfully";

        }

        public async Task<List<GetAnnouncementDtos>?> GetAnnouncements()
        {
            var annoucement = await _db.Announcements.Include(e=>e.Books).ToListAsync();

            var annoucementDtoList =  annoucement.Select(e => AnnoucementExtensionMethod.ConvertToDto(e)).ToList();

            return annoucementDtoList ?? [];

        }
    }
}
