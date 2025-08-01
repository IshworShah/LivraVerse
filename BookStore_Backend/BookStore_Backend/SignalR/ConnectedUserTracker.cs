namespace BookStore_Backend.SignalR
{
    public class ConnectedUserTracker
    {


        private readonly Dictionary<string, string> _userConnections= new();

        public void addUser(string userId ,string connectionId)
        {

            lock (_userConnections)
            {
                _userConnections[connectionId] = userId;
            }
        }

        public void RemoveUser(string connectionId)
        {

            lock (_userConnections)
            {
                _userConnections.Remove(connectionId);
            }



        }


        public IList<string>? GetConnectionIds(string userId)
        {

            lock (_userConnections)
            {

                return _userConnections.Where(dic => dic.Value == userId).Select(dic => dic.Key).ToList() ?? null;
                
            }



        }








    }
}
