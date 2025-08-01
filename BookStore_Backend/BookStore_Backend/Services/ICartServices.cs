using BookStore_Backend.DatabaseeContextt;
using BookStore_Backend.Helper.Extensions;
using BookStore_Backend.Model;
using BookStore_Backend.Model.Dtos.CartDtos;
using BookStore_Backend.Model.Dtos.UserDtos;
using Microsoft.EntityFrameworkCore;

namespace BookStore_Backend.Services
{
    public interface ICartServices
    {
        Task<List<CartItemDtos>> getUserCartItems(Guid cartId);
        Task AddCartItem(AddCartDto addCartDto);

        Task DeleteCart(DeleteCartDtos cartDtos);

    }


    public class ICartServicesImplementation : ICartServices
    {

        private readonly AppDbContext _db;

        public ICartServicesImplementation(AppDbContext appDbContext)
        {
            _db = appDbContext;

        }

        public async Task AddCartItem(AddCartDto addCartDto)
        {
            
            var cart = await _db.Carts.FirstOrDefaultAsync(e => e.Id == addCartDto.CartId);

            if (cart == null) throw new Exception("Please Use correct Cart");


            var existingCartItem =await _db.CartItems.FirstOrDefaultAsync(e => e.CartId == addCartDto.CartId && e.BookId == addCartDto.BookId);


            if (existingCartItem == null)
            {

               CartItem cartItem = CartExtensionMethod.ConvertDto(addCartDto,_db);

                await _db.CartItems.AddAsync(cartItem);
                cart.Items ??= new List<CartItem>();
                

            }
            else
            {
                existingCartItem.Quantity += 1;
                _db.CartItems.Update(existingCartItem);

            }

            cart.TotalPrice = cart.Items!.Sum(i => i.unitPrice * i.Quantity);
            cart.DiscountedPrice = cart.TotalPrice - (cart.TotalPrice * (cart.DiscountPercentage / 100));

            await _db.SaveChangesAsync();
        }

        public async Task DeleteCart(DeleteCartDtos cartDtos)
        {

            var cart = await _db.Carts.FindAsync(cartDtos.CartId);

            if (cart == null) throw new Exception("Cart Diesn't Exist");


            var cartItem = await _db.CartItems.FindAsync(cartDtos.CartItemId);

            if (cartItem == null) throw new Exception("Cart Item Doesnt Exist");


            // Always remove the entire cart item regardless of quantity
            _db.CartItems.Remove(cartItem);
            cart.Items!.Remove(cartItem);
            
            cart.TotalPrice = cart.Items!.Sum(i => i.unitPrice * i.Quantity);
            cart.DiscountedPrice = cart.TotalPrice - (cart.TotalPrice * (cart.DiscountPercentage / 100));

            await _db.SaveChangesAsync();
        }

        public async Task<List<CartItemDtos>> getUserCartItems(Guid cartId)
        {

            var query =  _db.Carts.AsQueryable();

            var userCart = await query.FirstOrDefaultAsync(e => e.Id == cartId);

            if (userCart == null) throw new Exception("Please Use Correct CartId");

            var cartItemList = await _db.CartItems.Where(e => e.CartId == cartId).Select(e => CartItemExtension.ConvertCartToDto(e.Id, _db)).ToListAsync();

                return cartItemList;



        }
    }

}
