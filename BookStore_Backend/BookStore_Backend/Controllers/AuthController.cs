using BCrypt.Net;
using BookStore_Backend.DatabaseeContextt;
using BookStore_Backend.Model;
using BookStore_Backend.Model.Dtos;
using BookStore_Backend.Model.Dtos.UserDtos;
using BookStore_Backend.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;


namespace BookStore_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthenticationServices _authServices;

        private readonly AppDbContext _db;

      public  AuthController(IAuthenticationServices authenticationServices,AppDbContext db)
        {
            _authServices = authenticationServices;

            _db = db;
        }

        [EnableRateLimiting("login")]
        [HttpPost("login")]
        public async Task<IActionResult>  Login(LoginDto loginDto)
        {

            var checkUserExist = _db.Users.Any(e => e.Email == loginDto.Email);

            if (!checkUserExist)
            {
                return NotFound("User Not Found Please SignIn");
            }

            var user = await _authServices.Authenticate(loginDto);

            if (user==null) {
                return BadRequest("authentication failed please enter correct password");
            }

            string accessToken =  _authServices.GenerateToken(user);

            return Ok(accessToken);


        }



        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserDto user)
        {

            bool CheckEmailExist = _db.Users.Any(e=>e.Email == user.Email);
            bool checkUsernameExist = _db.Users.Any(e => e.Username == user.Username);

            if (CheckEmailExist)
            {
                return BadRequest($"User With email :{user.Email} already exist");
            }

            if (checkUsernameExist)
            {
                return BadRequest($"User with Username : {user.Username} already exist");
            }

            var createCart = await _db.Carts.AddAsync(new Cart() { 
                Id=Guid.NewGuid(),
            });
            //salt is need for verification
            int salt = 12;
            var passwordHashed = BCrypt.Net.BCrypt.HashPassword(user.PasswordHash,salt);
            user.PasswordHash=passwordHashed;

            var userEntity  =   new User().ConvertUserFormDto(user);
           userEntity.CartId = createCart.Entity.Id;   
            var registerResult = await _db.Users.AddAsync(userEntity);
            _db.SaveChanges();
                
            return Created("user Created", user);

            }



        [HttpGet("UserData/{UserId:guid}")]
        public async Task<IActionResult> GetUserData([FromRoute] Guid UserId)
        {

            var result = await _authServices.GetUserDetail(UserId);
            return Ok(result);

        }

        
        

         
        }







    }

