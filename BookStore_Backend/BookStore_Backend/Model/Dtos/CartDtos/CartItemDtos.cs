using BookStore_Backend.Model.Dtos.BookDtos;
using System.ComponentModel.DataAnnotations;

namespace BookStore_Backend.Model.Dtos.CartDtos
{
    public class CartItemDtos
    {
        public Guid Id { get; set; }

        public BookSummaryDto? Book { get; set; }

        public int Quantity { get; set; }

        public double unitPrice { get; set; }
    }
}
