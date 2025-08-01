using BookStore_Backend.DatabaseeContextt;
using BookStore_Backend.Model.Dtos.WishListDtos;
using BookStore_Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookStore_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : ControllerBase
    {

        private readonly AppDbContext _dbContext;

        private readonly IWishlistServices _wishlistServices;


        public WishlistController(AppDbContext db,IWishlistServices wishlistServices)
        {
            _wishlistServices = wishlistServices;
            _dbContext = db;
        }

        [HttpGet("wishlist")]
        public async Task<IActionResult> GetAllWishList(Guid UserId)
        {
            var result = await _wishlistServices.GetWishLists(UserId);
            return Ok(result);

        }

        [HttpDelete("wishlist/{wishlistId:guid}")]
        public async Task<IActionResult> DeleteWishList([FromRoute] Guid wishlistId)
        {
            try
            {
                var result = await _wishlistServices.DeleteWishList(wishlistId);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost("wishlist")]
        public async Task<IActionResult> AddWishList(AddWishlistDto addWishlistDto)
        {
            try
            {
                var result = await _wishlistServices.AddWishList(addWishlistDto);
                return Ok("Successfully Added To WishList");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        


    }
}
