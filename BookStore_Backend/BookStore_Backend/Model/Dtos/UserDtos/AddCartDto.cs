using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace BookStore_Backend.Model.Dtos.UserDtos
{
    public class AddCartDto
    {
 
        public Guid BookId { get; set; }

        public Guid CartId { get; set; }


        [JsonIgnore]
        public int Quantity { get; set; }
        [JsonIgnore]
        public double unitPrice { get; set; }
    }
}
