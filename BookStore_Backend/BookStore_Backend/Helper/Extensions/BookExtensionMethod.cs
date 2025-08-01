using BookStore_Backend.Model;
using BookStore_Backend.Model.Dtos.BookDtos;

namespace BookStore_Backend.Helper.Extensions
{
    public static class BookExtensionMethod
    {


        public static Book ConvertBookDtoToBook(BookDto bookDto)
        {
            return new Book()
            {
                Author = bookDto.Author,
                PhysicalLibraryAvailability = bookDto.PhysicalLibraryAvailability,
                Description = bookDto.Description,
                DiscountPercent = bookDto.DiscountPercent,
                DiscountTime = bookDto.DiscountTime,
                EditionType = bookDto.EditionType,
                Format = bookDto.Format,
                StockQuantity = bookDto.StockQuantity,
                ISBN = bookDto.ISBN,
                Genres = bookDto.Genres!,
                IsOnSale = bookDto.IsOnSale,
                languages = bookDto.languages,
                Price = bookDto.Price,
                PublicationDate = bookDto.PublicationDate,
                Title = bookDto.Title
            };
           





        }

    }
}
