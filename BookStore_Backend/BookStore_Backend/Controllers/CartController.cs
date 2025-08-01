using BookStore_Backend.Model.Dtos.CartDtos;
using BookStore_Backend.Model.Dtos.UserDtos;
using BookStore_Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BookStore_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {

        private readonly ICartServices _cartServices;

        public CartController(ICartServices cartServices)
        {
            _cartServices = cartServices;
        }


      
        

        [HttpGet("{cartId}")]
        public async Task<IActionResult> GetcartItems(Guid cartId)
        {
            var result = await _cartServices.getUserCartItems(cartId);
            return Ok(result);
        }

        [EnableRateLimiting("checkout")]
        [HttpPost]
        public async Task<IActionResult> AddToCart(AddCartDto cartItems)
        {
            try
            {

                await _cartServices.AddCartItem(cartItems);
                return Ok("Added To Cart Sucessfully");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }


        }


        [HttpDelete]
        public async Task<IActionResult> RemoveCartItem(DeleteCartDtos cartDtos)
        {
            await _cartServices.DeleteCart(cartDtos);
            return Ok("Cart Item Removed Sucessfully");
        }






    }
}
