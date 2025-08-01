using BookStore_Backend.DatabaseeContextt;
using BookStore_Backend.Model.Dtos.OrderDtos;
using BookStore_Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace BookStore_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly AppDbContext _db;
        public readonly IOrderServices _orderServices;
        
        public OrderController(AppDbContext appDbContext, IOrderServices orderServices)
        {
            _db = appDbContext;
            _orderServices = orderServices;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllOrder()
        {
            var result = await _orderServices.GetAllOrder();
            
            // Return as a proper JSON array instead of using .ToArray()
            return Ok(result.ToList());
        }

        [HttpGet("personal/{userId}")]
        public async Task<IActionResult> GetOrder(Guid userId)
        {
            var user = await _db.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User Doesnt Exist");
            }

            var result = await _orderServices.GetUserOrderHistory(user);
            
            // Return as a proper JSON array instead of using .ToArray()
            return Ok(result.ToList());
        }

        [EnableRateLimiting("checkout")]
        [HttpPost]
        public async Task<IActionResult> AddOrder(AddOrderDtos addOrderDtos)
        {
            try
            {
                var user = await _db.Users.FindAsync(addOrderDtos.UserId);

                if (user == null)
                {
                    return NotFound("User Not Found");
                }

                var result = await _orderServices.AddOrder(addOrderDtos, user);

                if (result == null)
                {
                    return BadRequest("Please Add Correct Values");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{OrderId:guid}")]
        public async Task<IActionResult> DeleteOrder(Guid OrderId)
        {
            var result = await _orderServices.DeleteOrder(OrderId);

            if (result == null)
            {
                return NotFound($"Order With OrderId : {OrderId} Not Found");
            }

            return Ok(result);
        }
    }
}