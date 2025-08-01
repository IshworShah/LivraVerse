namespace BookStore_Backend.Model
{
    public class PagninatedList<T>
    {
        public List<T> Items { get; set; }
        public int PageNumber { get; set; }
        public int TotalPage{ get; set; }

        public bool HasPreviousPage => PageNumber > 1;
        public bool HasNextPage => PageNumber < TotalPage;


        public PagninatedList(List<T> items,int pageNumber,int totalPage)
        {
            Items = items;
            PageNumber = pageNumber;
            TotalPage = totalPage;


        }

      
    }
}
