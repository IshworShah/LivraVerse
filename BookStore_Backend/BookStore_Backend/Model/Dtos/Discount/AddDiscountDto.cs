namespace BookStore_Backend.Model.Dtos.Discount
{
    public class AddDiscountDto
    {
        public Guid BookId { get; set; }
        public double DiscountPercent {get;set;}
        public bool isSale { get; set; }

    }
}
