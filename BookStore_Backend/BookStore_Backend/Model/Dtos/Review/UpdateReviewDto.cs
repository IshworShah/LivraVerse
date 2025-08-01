namespace BookStore_Backend.Model.Dtos.Review
{
    public class UpdateReviewDto
    {
        public Guid ReviewId { get; set; }

        public String Text { get; set; }

        public int rating { get; set; }


    }
}
