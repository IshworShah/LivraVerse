using System.Security.Claims;

namespace BookStore_Backend.Services
{
    public interface IUserServices
    {

        Guid? userId { get; }
    }


    public class IUserServicesImplementation(IHttpContextAccessor httpContextAccessor) : IUserServices
    {
        public Guid? userId
        {
           get
            {
                var userId = httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                return Guid.TryParse(userId,out var id)?id:null;
            }
        }
    }



}
