namespace BookStore_Backend.Model.Dtos.CartDtos
{
    public class DeleteCartDtos
    {
        public Guid CartId { get; set; }
        public Guid CartItemId { get; set; }
    }
}
