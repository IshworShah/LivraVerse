using BookStore_Backend.Model;
using Microsoft.EntityFrameworkCore;

namespace BookStore_Backend.DatabaseeContextt
{
    public class AppDbContext : DbContext
    {

        public AppDbContext(DbContextOptions options) : base(options) {


        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {


            //for consistency of Id Of Admin
            var adminId = Guid.Parse("01111111-2222-3333-4444-555555555555");
            var staffId = Guid.Parse("02222222-2222-3555-4444-555555555555");
            var password = "Ishwor321#";

            var adminCartId = Guid.Parse("01111111-5555-8888-9999-555555555555");
            var staffCartId = Guid.Parse("01111111-3333-2222-9999-555555555555");


            var adminCart = new Cart()
            {
                Id = adminCartId,
                DiscountedPrice = 0,
                DiscountPercentage = 0,
                TotalPrice=0

            };

            var staffCart = new Cart()
            {
                Id = staffCartId,
                DiscountedPrice = 0,
                DiscountPercentage = 0,
                TotalPrice = 0



            };


            modelBuilder.Entity<Cart>().HasData(adminCart, staffCart);

            var admin = new User()
            {
                Id = adminId,
                Username = "Admin",
                Email = "admin@gmail.com",
                PasswordHash = password,
                Role = "Admin",
                CartId=adminCartId
                


            };

            var staff = new User()
            {
                Id = staffId,
                Username = "Staff",
                Email = "staff@gmail.com",
                PasswordHash = password,
                Role = "Staff",
                CartId = staffCartId

            };

            

            modelBuilder.Entity<User>().HasData(admin,staff);


            modelBuilder.Entity<User>().HasMany(o => o.WishLists).WithOne(e=>e.User).HasForeignKey(e => e.Bookmark_Id);

            modelBuilder.Entity<User>().HasMany(o => o.Reviews).WithOne(e=>e.User).HasForeignKey(e => e.UserId);
          
            modelBuilder.Entity<Order>().HasOne(e => e.User).WithMany(e => e.Orders).HasForeignKey(e => e.UserId);

            modelBuilder.Entity<Announcement>().HasMany(e => e.Books).WithOne(e => e.Announcement).HasForeignKey(e => e.AnnouncementId);

            modelBuilder.Entity<Book>().HasMany(e => e.Reviews).WithOne(e=>e.Book).HasForeignKey(e => e.BookId);

  
         

            modelBuilder.Entity<OrderItem>().HasOne(e => e.Book).WithMany().HasForeignKey(e => e.BookId);
            modelBuilder.Entity<OrderItem>().HasOne(e => e.Order).WithMany().HasForeignKey(e => e.OrderId);

            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.Book)
                .WithMany()
                .HasForeignKey(ci => ci.BookId);

            modelBuilder.Entity<CartItem>()
                .HasOne(ci => ci.Cart)
                .WithMany(c => c.Items)
                .HasForeignKey(ci => ci.CartId);

            modelBuilder.Entity<CartItem>()
                .HasIndex(ci => new { ci.CartId, ci.BookId })
                .IsUnique();
            modelBuilder.Entity<User>()
          .HasOne(u => u.Cart)
          .WithOne(c => c.User)
          .HasForeignKey<User>(u => u.CartId);

            modelBuilder.Entity<WishList>().HasOne(e => e.Book).WithOne().HasForeignKey<WishList>(e => e.BookId);
            modelBuilder.Entity<Review>().HasOne(e => e.Book).WithMany().HasForeignKey(e => e.BookId);

            modelBuilder.Entity<Book>().Property(e=>e.StockQuantity).HasConversion(typeof(int));
            


         
        }



       
        public DbSet<Book> Books { get; set; }
        public DbSet<User> Users { get; set; }

        public DbSet<WishList> WishLists { get; set; }  
        
        public DbSet<Review> Reviews { get; set; }  

        public DbSet<Announcement> Announcements { get; set; }  

        public DbSet<Order> Order { get; set; }

        public DbSet<Cart> Carts { get; set; }

        public DbSet<OrderItem> OrderItems { get; set; } 

        public DbSet<CartItem> CartItems { get; set; }

        




    }
}
