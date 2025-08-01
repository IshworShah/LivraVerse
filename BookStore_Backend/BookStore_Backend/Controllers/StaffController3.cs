using BookStore_Backend.DatabaseeContextt;
using BookStore_Backend.Model.Dtos;
using BookStore_Backend.Model.Enum;
using BookStore_Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

namespace BookStore_Backend.Controllers
{
    [DisableRateLimiting]
    [Route("api/[controller]")]
    [ApiController]
    public class StaffController : ControllerBase
    {

        private readonly IStaffService _staffService;
        private readonly AppDbContext _db;

       public StaffController(IStaffService staffService,AppDbContext db)
        {
            _staffService = staffService;
            _db = db;
        }


        [HttpPatch]
        public async Task<IActionResult> UpdateOrder(UpdateOrderDtos updateOrderDtos)
        {
            if (updateOrderDtos.ClaimCode == null)
            {
                return BadRequest("Please Add User Claim Code");
            }

            var user = await _db.Users.FindAsync(updateOrderDtos.MemberId);

            if (user == null)
            {
                return NotFound("User Not Found");
            }

                var order = await _db.Order.Where(e => e.UserId == updateOrderDtos.MemberId && e.orderStatus != OrderStatus.Completed).FirstOrDefaultAsync(e => e.Order_Id == updateOrderDtos.OrderId);


          

            if (order == null)
            {
                return BadRequest("Order Cant Be Updated");
            }

            var result = await _staffService.UpdateOrder(order,updateOrderDtos.ClaimCode!,user);



            return Ok(result);
         }






    }
}
