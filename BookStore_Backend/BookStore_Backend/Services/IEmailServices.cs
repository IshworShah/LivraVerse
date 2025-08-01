using BookStore_Backend.Model;
using BookStore_Backend.Model.Dtos;
using Microsoft.Extensions.Options;
using MimeKit;
using MailKit;
using MailKit.Net.Smtp;

namespace BookStore_Backend.Services
{
    public interface IEmailServices
    {
        Task SendEmail(EmailDtos emailDtos);
    }

    public class IEmailServiceImplementation : IEmailServices
    {

      private readonly  EmailSettings _setting;
      public  IEmailServiceImplementation(IOptions<EmailSettings> email)
        {
            _setting = email.Value;

        }

        public async Task  SendEmail(EmailDtos emailDtos)
        {
            var emailRequest = new MimeMessage();
            emailRequest.From.Add(new MailboxAddress(_setting.SenderName,_setting.SenderEmail));
            emailRequest.To.Add(MailboxAddress.Parse(emailDtos.ToEmail));
            emailRequest.Subject = emailDtos.Subject;

            var builder = new BodyBuilder();

            builder.HtmlBody = emailDtos.Body;

            emailRequest.Body = builder.ToMessageBody();

            using (var smtp = new SmtpClient())
            {
              await  smtp.ConnectAsync(_setting.SmtpServer, _setting.SmtpPort, MailKit.Security.SecureSocketOptions.StartTls);
             await   smtp.AuthenticateAsync(_setting.Username, _setting.Password);
            await smtp.SendAsync(emailRequest);
                await smtp.DisconnectAsync(true);
            }




        }
    }


}
