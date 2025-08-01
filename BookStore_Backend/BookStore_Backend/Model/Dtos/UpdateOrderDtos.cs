using BookStore_Backend.Model.Enum;

namespace BookStore_Backend.Model.Dtos
{
    public class UpdateOrderDtos
    {
        public Guid OrderId { get; set; }
        public String? ClaimCode { get; set; }

        public Guid MemberId { get; set; }

    }
}
