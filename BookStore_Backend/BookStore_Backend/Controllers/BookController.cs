using BookStore_Backend.DatabaseeContextt;
using BookStore_Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BookStore_Backend.Model;
using Microsoft.EntityFrameworkCore;
using BookStore_Backend.Model.Enum;
using BookStore_Backend.Model.Dtos.BookDtos;
using Microsoft.AspNetCore.RateLimiting;

namespace BookStore_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {

        private readonly IBookServices _bookServices;
        private readonly AppDbContext _db;

        public BookController(IBookServices services, AppDbContext db) {
            _bookServices = services;
            _db = db;
        }


        [HttpGet("books")]
        public async Task<IActionResult> GetAllBook([FromQuery] BookQueryParameter bookQueryParameter)
        {
            var result = await _bookServices.GetBook(bookQueryParameter);
            return Ok(result);

        }

        [HttpGet("book/{Id}")]
        public async Task<IActionResult> GetBook([FromRoute] Guid Id)
        {
            var result = await _bookServices.specificBook(Id);
            return Ok(result);

        }


        [DisableRateLimiting]
        [HttpPost("AddBook")]
        public async Task<IActionResult> AddBook([FromForm] BookDto bookDto)
        {
            var checkBookExist = await _db.Books.FirstOrDefaultAsync(e => e.ISBN == bookDto.ISBN && e.Title == bookDto.Title);

            if (checkBookExist != null)
            {
                return BadRequest("ERR!! book you are trying to add already exist in system");
            }
            var result = await _bookServices.AddBook(bookDto);
            if (result == null)
            {
                return StatusCode(500, "Unexpcected Error Please Try Again");
            }

            return Ok(result);

        }





        //make controller always clean OK matra always yaad gara 

        //Exception handle inside  services
        //update create ma void use

        [DisableRateLimiting]
        [HttpPut("UpdateBook")]
        public async Task<IActionResult> UpdateBook([FromForm] UpdateBookDtos updateBookDtos)
        {

            var result = await _bookServices.UpdateBook(updateBookDtos);
           
            return Ok($"Book With Id Sucessfully Updated : {result}");

        }




        



        [HttpGet("book/categories")]
        public async Task<IActionResult> GetBookCategory()
        {

            var result = await _bookServices.GetBookCategories();

            return Ok(result);
        }



        //upload image







        //delete image 
        [DisableRateLimiting]
        [HttpPatch("UpdateStatus/{bookId:guid}")]
        public async Task<IActionResult> UpdateBookStatus([FromRoute] Guid bookId)
        {

            var book = await _db.Books.FindAsync(bookId);
            if (book == null)
            {
                return NotFound($"Book With Id:{bookId} not found");
            }

            book.DeleteStatus = !book.DeleteStatus;


            _db.Books.Update(book);

            await _db.SaveChangesAsync();


            return Ok(book.Book_Id);


        }


        [NonAction]
        private static string UploadImage(IFormFile file)
        {
            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");

            if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

            var filePath = Path.Combine(folderPath, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);

            file.CopyTo(stream);

            return fileName;
        }



    }
}
