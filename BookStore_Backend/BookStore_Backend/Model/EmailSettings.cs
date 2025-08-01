namespace BookStore_Backend.Model
{
    public class EmailSettings
    {
        public String SmtpServer { get; set; } = String.Empty;
        public int SmtpPort { get; set; } = 587;

        public string SenderName { get; set; } = string.Empty;

        public string SenderEmail { get; set; } = string.Empty;

        public string Username { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;



    }
}
