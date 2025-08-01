using System.ComponentModel.DataAnnotations.Schema;

namespace BookStore_Backend.Model
{
    public class Discount
    {
        public Guid BookId { get; set; }

        public bool MarkAsSale { get; set; }

        public decimal DiscountPercentage { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        [ForeignKey(nameof(BookId))]
        public virtual Book? Book { get; set; }


    }
}
