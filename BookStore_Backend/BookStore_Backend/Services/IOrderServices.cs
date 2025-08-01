using BookStore_Backend.DatabaseeContextt;
using BookStore_Backend.Helper.Extensions;
using BookStore_Backend.Model;
using BookStore_Backend.Model.Dtos;
using BookStore_Backend.Model.Dtos.OrderDtos;
using BookStore_Backend.Model.Enum;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace BookStore_Backend.Services
{
    public interface IOrderServices
    {
        Task<List<GetOrderDtos>> GetAllOrder();
        Task<List<GetOrderDtos>> GetUserOrderHistory(User user);
        Task<string?> AddOrder(AddOrderDtos orderDtos, User user);
        Task<string?> DeleteOrder(Guid orderId); 
    }

    public class IOrderServicesImplementation : IOrderServices
    {
        private readonly AppDbContext _db;
        private readonly IEmailServices _emailServices;
    
        public IOrderServicesImplementation(AppDbContext db, IEmailServices emailServices)
        {
            _db = db;
            _emailServices = emailServices;
        }

        public async Task<string?> AddOrder(AddOrderDtos orderDtos, User user)
        {
            if (orderDtos.OrderItems == null || !orderDtos.OrderItems.Any())
                return "Order must contain at least one item.";

            using var transaction = await _db.Database.BeginTransactionAsync();
            try
            {
                // Step 1: Convert DTO to Order entity
                var order = AddOrderExtensionMethod.ConvertToOrder(orderDtos);
                order.UserId = user.Id;

                await _db.Order.AddAsync(order);
                await _db.SaveChangesAsync();

                // Step 2: Convert and add OrderItems
                var orderItems = OrderItemExtensionMethod.ConvertToOrderItem(
                    orderDtos.OrderItems.ToList(), order.Order_Id
                );

                await _db.OrderItems.AddRangeAsync(orderItems);
                await _db.SaveChangesAsync();

                // Step 3: Commit transaction (only after DB operations)
                await transaction.CommitAsync();

                // Step 4: Send confirmation email (outside transaction)
                var orderCode = order.Order_Id.ToString().Split('-')[0];
                var emailDto = new EmailDtos
                {
                    ToEmail = "ishwors720@gmail.com",
                    Subject = "Claim code for Livre Store order",
                    Body = $"Your order was placed successfully! Code: {orderCode}"
                };

                try
                {
                    await _emailServices.SendEmail(emailDto);
                }
                catch (Exception emailEx)
                {
                    // Log but don't fail order if email fails
                    Console.WriteLine("Order saved but failed to send email: " + emailEx.Message);
                }

                return $"Order completed successfully. Order ID: {order.Order_Id}";
            }
            catch (Exception ex)
            {
                // Only rollback if transaction is still active
                if (transaction.GetDbTransaction()?.Connection != null)
                {
                    await transaction.RollbackAsync();
                }

                Console.WriteLine("Error placing order: " + ex.Message);
                return "Failed to complete the order.";
            }
        }


        public async Task<string?> DeleteOrder(Guid orderId)
        {
            var order = await _db.Order.FindAsync(orderId);
            if (order == null)
                return null;

            if (order.orderStatus== OrderStatus.Completed)
                return "Order status is already completed.";

            var orderItems = _db.OrderItems.Where(oi => oi.OrderId == orderId);

            _db.OrderItems.RemoveRange(orderItems);
            _db.Order.Remove(order);

            await _db.SaveChangesAsync();
            return $"Order with ID {orderId} removed successfully.";
        }

        public async Task<List<GetOrderDtos>> GetAllOrder()
        {
            var orders = await _db.Order.Include(o => o.User).ToListAsync();
            var orderDtos = orders.Select(order => OrderExtensionMethod.ConvertDtos(order, _db)).ToList();
            return orderDtos;
        }

        public async Task<List<GetOrderDtos>> GetUserOrderHistory(User user)
        {
            var orders = await _db.Order
                .Where(o => o.UserId == user.Id)
                .Include(o => o.User)
                .ToListAsync();

            var orderDtos = orders.Select(order => OrderExtensionMethod.ConvertDtos(order, _db)).ToList();
            return orderDtos;
        }
    }
}
