namespace BookStore_Backend.Model.Dtos.BookDtos
{
    public class BookCategories
    {
        public List<Book>? Bestsellers { get; set; }
        public List<Book>? AwardWinner { get; set; }
        public List<Book>? NewReleases  { get; set; }//past 3 month
        public List<Book>? NewArrival { get; set; }//past 1 month
        public List<Book>? ComingSoon { get; set; }
        public List<Book>? Deals { get; set; }//future date > today
       

    }
}
