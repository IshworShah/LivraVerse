using BookStore_Backend.DatabaseeContextt;
using BookStore_Backend.Model.Dtos.AnnouncementDtos;
using BookStore_Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace BookStore_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnnouncementController : ControllerBase
    {

        private readonly AppDbContext _Db;
        private readonly IAnnouncementService _announcementService;

        public AnnouncementController(AppDbContext Db, IAnnouncementService announcementService)
        {
            _Db = Db;
            _announcementService = announcementService;
        }



        [HttpGet]
        public async Task<IActionResult> Get()
        {

            var result = await _announcementService.GetAnnouncements();

            return Ok(result);

        }

        [DisableRateLimiting]
        [HttpPost]
        public async Task<IActionResult> Add(AddAnnouncementDtos addAnnouncement)
        {

            if (!addAnnouncement.isActive)
            {
                return BadRequest("EndDate Is Already Expired. Please Increase It");
            }

            var book = await _Db.Books.Where(e => addAnnouncement.BookDtos!.Contains(e.Book_Id)).ToListAsync();

            if (book.Count != addAnnouncement.BookDtos!.Count)
            {
                var missingBookIds = addAnnouncement.BookDtos.Except(book.Select(e => e.Book_Id));

                var ids = string.Join(", ", missingBookIds.Select(id => id.ToString()));
                return BadRequest($"The Following Book With BookId {ids} Doesnot Exist");
            }

            var result = await _announcementService.AddAnnoucement(book, addAnnouncement);
            return Ok(result);
        }

        [DisableRateLimiting]
        [HttpPut("{AnnouncementId:guid}")]
        public async Task<IActionResult> Update(Guid AnnouncementId,AddAnnouncementDtos updatedAnnouncement)
        {
      
            var announcement = await _Db.Announcements
                .Include(a => a.Books)
                .FirstOrDefaultAsync(a => a.Id == AnnouncementId);

            if (announcement == null)
            {
                return NotFound("Announcement not found.");
            }

            
            var newBooks = await _Db.Books
                .Where(b => updatedAnnouncement.BookDtos!.Contains(b.Book_Id))
                .ToListAsync();

            if (newBooks.Count != updatedAnnouncement.BookDtos!.Count)
            {
                var missing = updatedAnnouncement.BookDtos.Except(newBooks.Select(b => b.Book_Id));
                return BadRequest($"Books with IDs {string.Join(", ", missing)} not found.");
            }

            foreach (var book in announcement.Books!.ToList())
            {
                book.AnnouncementId = null;
            }

            announcement.Title = updatedAnnouncement.Title;
            announcement.Messsage = updatedAnnouncement.Messsage;
            announcement.StartDate = updatedAnnouncement.StartDate;
            announcement.EndDate = updatedAnnouncement.EndDate;
           

           
            foreach (var book in newBooks)
            {
                book.AnnouncementId = announcement.Id;
            }

            
            await _Db.SaveChangesAsync();
            return Ok("Announcement updated successfully.");
        }




        [DisableRateLimiting]
        [HttpDelete("{AnnouncementId:guid}")]

        public async Task<IActionResult> Delete(Guid AnnouncementId)
        {

            var result = await _Db.Announcements.Include(e=>e.Books).FirstOrDefaultAsync(e=>e.Id==AnnouncementId);

            if (result == null)
            {
                return Problem(statusCode:StatusCodes.Status404NotFound,
                    type: "https://datatracker.ietf.org/doc/html/rfc7231#section-6.5.4",
                    title:"Bad Request",detail:$"Annoucement With ID : {AnnouncementId} Doesnt Exist"
                     );
            }
    

            
            foreach(var book in result!.Books!)
            {

                book.AnnouncementId = null;

            }



            _Db.Announcements.Remove(result!);
            await _Db.SaveChangesAsync();

            return Ok($"Annoucement with Id: {result!.Id} Removed Sucessfully");
            

        }




    }
}
