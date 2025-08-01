using BookStore_Backend.Model.Enum;

namespace BookStore_Backend.Model.Dtos.BookDtos
{
    public class BookQueryParameter
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public double? MinPrice { get; set; }
        public double? MaxPrice { get; set; }
        public string? Author { get; set; }
        public string? SearchQuery { get; set; }
        public Languages? Language { get; set; }
        public Genre? Genre { get; set; }
        public EditionType? EditionType { get; set; }
        public Format? Format { get; set; }
        public string? SortBy { get; set; }  // e.g., "price", "title"
        public string SortOrder { get; set; } = "asc";
    }


}
