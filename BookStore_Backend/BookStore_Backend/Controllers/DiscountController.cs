using BookStore_Backend.DatabaseeContextt;
using BookStore_Backend.Model.Dtos.Discount;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStore_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DiscountController(AppDbContext _Db) : ControllerBase
    {

        [HttpPost]
        public async Task<IActionResult> AddDiscount(List<AddDiscountDto> addDiscounts)
        {
            var bookIds = addDiscounts.Select(d => d.BookId).ToList();

            var books = await _Db.Books
                .Where(b => bookIds.Contains(b.Book_Id))
                .ToListAsync();

            if (books.Count != bookIds.Count)
            {
                return BadRequest("Some books not found.");
            }

            foreach (var book in books)
            {
                var matchingDiscount = addDiscounts.FirstOrDefault(d => d.BookId == book.Book_Id);
                if (matchingDiscount != null)
                {
                    book.DiscountPercent = matchingDiscount.DiscountPercent;
                    book.IsOnSale = matchingDiscount.isSale;
                }
            }

            await _Db.SaveChangesAsync();
            return Ok("Discounts applied successfully.");



        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateDiscount(AddDiscountDto updateDiscount)
        {
            var book = await _Db.Books.FirstOrDefaultAsync(b => b.Book_Id == updateDiscount.BookId);
            if (book == null)
            {
                return NotFound("Book not found.");
            }

            book.DiscountPercent = updateDiscount.DiscountPercent;
            book.IsOnSale = updateDiscount.isSale;

            await _Db.SaveChangesAsync();
            return Ok("Discount updated successfully.");
        }


        [HttpDelete("delete/{bookId:guid}")]
        public async Task<IActionResult> DeleteDiscount(Guid bookId)
        {
            var book = await _Db.Books.FirstOrDefaultAsync(b => b.Book_Id == bookId);
            if (book == null)
            {
                return NotFound("Book not found.");
            }

            book.DiscountPercent = 0;
            book.IsOnSale = false;

            await _Db.SaveChangesAsync();
            return Ok("Discount removed.");
        }



    }
}
