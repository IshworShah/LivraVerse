using BookStore_Backend.Services;
using Microsoft.AspNetCore.SignalR;

namespace BookStore_Backend.SignalR
{
    public sealed class Notification(ConnectedUserTracker tracker,IUserServices userServices):Hub
    {
        public override Task OnConnectedAsync()
        {
            var userId = userServices.userId;
            tracker.addUser(userId.ToString()??string.Empty, Context.ConnectionId);
           
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {

            tracker.RemoveUser(Context.ConnectionId);


            return base.OnDisconnectedAsync(exception);
        }



    }
}
