using BookStore_Backend.DatabaseeContextt;
using BookStore_Backend.Model;
using BookStore_Backend.Model.Dtos.Review;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStore_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController(AppDbContext _Db) : ControllerBase
    {


       


        [HttpPost]
        public async Task<IActionResult> AddReview(AddReviewDtos addReview)
        {

            var checkBookExist = await _Db.Books.FindAsync(addReview.BookId);


            if (checkBookExist == null)
            {
                return NotFound("Book Not Found");


            }
         var reviewEligibility = await _Db.Order.Where(e => e.UserId == addReview.UserId && e.orderStatus == Model.Enum.OrderStatus.Completed).Select(e=>e.Order_Id).ToListAsync();

            if (reviewEligibility == null)
            {
                return BadRequest("Order Status is left to complete");
            }
          

            var checkBookIsPurchased = _Db.OrderItems.Any(e => e.BookId == checkBookExist.Book_Id && reviewEligibility.Contains(e.OrderId));

            if (!checkBookIsPurchased)
            {
                return BadRequest("Book Is Not Purchased So cant Add Review");
            }

            var review = new Review()
            {
                Id = Guid.NewGuid(),
                BookId=checkBookExist.Book_Id,
                Ratings=addReview.Ratings,
                Text= addReview.Text,
                UserId=addReview.UserId
            };

            var result = _Db.Reviews.AddAsync(review);
            await _Db.SaveChangesAsync();
            return Ok($"Review Add to Book {checkBookExist.Title}");


        }




        [HttpPut]
        public async Task<IActionResult> UpdateReview(UpdateReviewDto updateReview)
        {
            var review =await _Db.Reviews.FindAsync(updateReview.ReviewId);

            if (review == null)
            {
                return NotFound("Review not found.");
            }
            review.Ratings = updateReview.rating;
            review.Text = updateReview.Text;

            _Db.Reviews.Update(review);
           await _Db.SaveChangesAsync();
            return Ok("Review Added Sucessfuly");
            ;
        }


    }
}
