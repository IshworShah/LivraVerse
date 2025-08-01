namespace BookStore_Backend.Model.Dtos.BookDtos
{
    public class BookSummaryDto
    {

        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string CoverImageUrl { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;


    }
}
