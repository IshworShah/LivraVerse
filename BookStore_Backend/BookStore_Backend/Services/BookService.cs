using BookStore_Backend.DatabaseeContextt;
using BookStore_Backend.Model;
using BookStore_Backend.Model.Enum;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.SqlServer.Server;
using System.Linq;
using BookStore_Backend.Helper.Extensions;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using BookStore_Backend.Model.Dtos.BookDtos;

namespace BookStore_Backend.Services
{
    public interface IBookServices
    {


       Task<Book> AddBook(BookDto bookDto);
        Task<PagninatedList<Book>> GetBook(BookQueryParameter bookQueryParameter);

        Task<Book?> specificBook(Guid Id);
        Task<BookCategories?> GetBookCategories();

        Task<Guid?> UpdateBook( UpdateBookDtos updateBookDtos);




      
    }


    public class IBookServicesImplementation : IBookServices
    {


        private readonly AppDbContext _db;
        public IBookServicesImplementation(AppDbContext db) {
       
            _db = db;

       }

        public async Task<Book?> AddBook(BookDto bookDto)
        {
            try
            {
                var book = BookExtensionMethod.ConvertBookDtoToBook(bookDto);
                var image = ImageExtensionMethod.UploadImage(bookDto.CoverImage);
                book.CoverImage = image;
                await _db.Books.AddAsync(book);
                await _db.SaveChangesAsync();
                return book;

            }
            catch (Exception ex)
            {
                 throw new Exception(ex.ToString());
            }
            return null;
  

        }


      

    
        public async Task<PagninatedList<Book>> GetBook(BookQueryParameter bookQueryParameter)
        {
            var book = _db.Books.AsQueryable();


            //searching
            if (!String.IsNullOrWhiteSpace(bookQueryParameter.SearchQuery))
            {

                book=book.Include(e=>e.Reviews).Where(e => e.ISBN.ToUpper().Contains(bookQueryParameter.SearchQuery!.ToUpper())
            || e.Title.ToUpper().Contains(bookQueryParameter.SearchQuery!.ToUpper())
            || e.Description.ToUpper().Contains(bookQueryParameter.SearchQuery!.ToUpper()));


            }

            //filtering 
            if (bookQueryParameter.Language.HasValue)
                book = book.Where(e => e.languages == bookQueryParameter.Language);
            if (bookQueryParameter.Genre.HasValue)
             book = book.Where(e => e.Genres!.Contains((Genre)bookQueryParameter.Genre));
            if (bookQueryParameter.MaxPrice.HasValue)
                book = book .Where(e => e.Price <= bookQueryParameter.MaxPrice);
            if (bookQueryParameter.EditionType.HasValue)
                book = book.Where(e => e.EditionType == bookQueryParameter.EditionType);
            if (bookQueryParameter.Format.HasValue)
                book = book.Where(e => e.Format == bookQueryParameter.Format);
            if(bookQueryParameter.MinPrice.HasValue)
                book = book.Where(e => e.Price >= bookQueryParameter.MinPrice);
            if (!String.IsNullOrEmpty(bookQueryParameter.Author))
                book = book.Where(e => e.Author == bookQueryParameter.Author);



            //sorting 

            if (!string.IsNullOrEmpty(bookQueryParameter.SortBy))
            {

                book = bookQueryParameter.SortBy!.ToLower() switch
                {

                    "title" => bookQueryParameter.SortOrder == "desc" ? book.OrderByDescending(e => e.Title) : book.OrderBy(e => e.Title),
                    "price" => bookQueryParameter.SortOrder == "desc" ? book.OrderByDescending(e => e.Price) : book.OrderBy(e => e.Price),
                    "popularity" => bookQueryParameter.SortOrder == "desc" ? book.OrderByDescending(e => e.Reviews!.Count()) : book.OrderBy(e => e.Reviews!.Count),
                    _ => book

                };
                



            }


         var result = await book.Skip((bookQueryParameter.PageNumber - 1) * bookQueryParameter.PageSize).Take(bookQueryParameter.PageSize).ToListAsync();
            var count = await _db.Books.CountAsync();
            int totalPageNumber = (int)Math.Ceiling(count / (decimal) bookQueryParameter.PageSize);

            return new PagninatedList<Book>( result,  bookQueryParameter.PageNumber,  totalPageNumber);            
        }

        public async Task<BookCategories?> GetBookCategories()
        {
        //    deafault = 0,
        //Best_Seller = 1,
        //Award_Winner = 2,
        //Comming_Soon = 3


            var Bestsellers = await _db.Books.Where(e=>e.Bookcategory==CategoryDtos.Best_Seller).ToListAsync();
            var AwardWinner = await _db.Books.Where(e => e.Bookcategory == CategoryDtos.Award_Winner).ToListAsync();
            var NewReleases = await _db.Books.Where(e => e.PublicationDate >= DateTime.UtcNow.AddMonths(-3)).ToListAsync();  //past 3 month
            var NewArrival = await _db.Books.Where(e => e.PublicationDate >= DateTime.UtcNow.AddMonths(-1)).ToListAsync(); //past 1 month
            var ComingSoon = await _db.Books.Where(e => e.PublicationDate >= DateTime.UtcNow.Date).ToListAsync();//future date > today
            var Deals = await _db.Books.Where(e => e.DiscountPercent>0 && e.DiscountTime>=DateTime.UtcNow.Date).ToListAsync(); //discounts


            return new BookCategories()
            {
                AwardWinner = AwardWinner,
                NewArrival = NewArrival,
                Bestsellers = Bestsellers,
                ComingSoon = ComingSoon,
                Deals = Deals,
                NewReleases = NewReleases
            };


        }

        public async Task<Book?> specificBook(Guid Id)
        {
            var book = await _db.Books.FindAsync(Id);
            return book;

        }

        public async Task<Guid?> UpdateBook(UpdateBookDtos updateBookDtos)
        {

            var book = await _db.Books.Include(e=>e.Reviews).FirstOrDefaultAsync(e=>e.Book_Id==updateBookDtos.Book_Id);

            if (book == null)
            {
                throw new Exception("Book Not Found");
            }


            book.ISBN = updateBookDtos.ISBN;
            book.Title = updateBookDtos.Title;
            book.ISBN = updateBookDtos.ISBN;
            book.PublicationDate = updateBookDtos.PublicationDate;
            book.Format = updateBookDtos.Format;
            book.Bookcategory = updateBookDtos.BookCategoty;
            book.Author = updateBookDtos.Author;
            book.Description = updateBookDtos.Description;
            book.languages = updateBookDtos.languages;
            book.PhysicalLibraryAvailability = updateBookDtos.PhysicalLibraryAvailability;
            book.Genres = updateBookDtos.Genres;
            book.StockQuantity = updateBookDtos.StockQuantity;
            book.Price = updateBookDtos.Price;
           

            var update = _db.Books.Update(book);

            await _db.SaveChangesAsync();

            return book.Book_Id;

           
        }
    }
}
