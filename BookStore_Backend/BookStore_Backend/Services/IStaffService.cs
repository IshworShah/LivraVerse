using BookStore_Backend.DatabaseeContextt;
using BookStore_Backend.Model;
using BookStore_Backend.Model.Dtos;
using BookStore_Backend.SignalR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace BookStore_Backend.Services
{
    public interface IStaffService
    {

        Task<string?> UpdateOrder(Order order,string claimCode,User user);

    }

    public class IstaffServiceImplementation : IStaffService
    {

        private readonly IHubContext<Notification> _hubContext;
        private readonly AppDbContext _db;
        public ConnectedUserTracker _connectedUser;

        public IstaffServiceImplementation(IHubContext<Notification> hubContext,AppDbContext db, ConnectedUserTracker connectedUser)
        {
            _hubContext = hubContext;
            _db = db;
            _connectedUser = connectedUser;
            _connectedUser = connectedUser;
        }

        public async Task<string?> UpdateOrder(Order order,string claimCode,User user)
        {

            var orderIdSubString = order.Order_Id.ToString().Split('-')[0];

            var ClaimCodeVerified = String.Equals(claimCode, orderIdSubString);


            if (!ClaimCodeVerified)
            {
                return null;
            }

            order.orderStatus = Model.Enum.OrderStatus.Completed;
          
            user.OrderCount += 1;

            if (user.OrderCount == 11)
            {
                user.OrderCount = 1;
            }

            await _db.SaveChangesAsync();

            var userId = user.Id.ToString();
            var connection = _connectedUser.GetConnectionIds(userId) ?? [];


            if (connection.Count > 0)
            {
                foreach (var connectionId in connection)
                {
                    await _hubContext.Clients.Client(connectionId).SendAsync("OrderCompleted", $"Hi {user.Username}, your order is now completed!");
                }
            }

               await  _hubContext.Clients.All.SendAsync("ReceiveNotification", "Congratulations, your order has been successfully completed.");

            return $"{order.Order_Id} was sucessfully updated";

           
        }
    }

}
