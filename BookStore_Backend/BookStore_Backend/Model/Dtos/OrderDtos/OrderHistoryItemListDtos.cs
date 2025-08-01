namespace BookStore_Backend.Model.Dtos.OrderDtos
{
    public class OrderHistoryItemListDtos
    {

        public string BookCoverImage { get; set; } = string.Empty;

        public string BookTitle { get; set; } = string.Empty;

        public Guid BookID { get; set; }



    }
}
