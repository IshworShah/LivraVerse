using BookStore_Backend.Model.Dtos.BookDtos;
using System.ComponentModel.DataAnnotations;

namespace BookStore_Backend.Model.Dtos.OrderDtos
{
    public class OrderItemDtos
    {
     public  Guid BookId { get; set; }
        public string? BookCover { get; set; }
     public string? BookTitle { get; set; }
        public int Quantity { get; set; }
        public double Price { get; set; }


    }
}
