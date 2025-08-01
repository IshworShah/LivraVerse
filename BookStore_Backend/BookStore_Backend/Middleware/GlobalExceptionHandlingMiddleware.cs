using Microsoft.AspNetCore.Mvc;

namespace BookStore_Backend.Middleware
{
    public class GlobalExceptionHandlingMiddleware
    {

        private readonly RequestDelegate _next;

        public GlobalExceptionHandlingMiddleware(RequestDelegate next)
        {
            _next = next;

        }


        public async Task Invoke(HttpContext context)
        {

            try
            {
                await _next(context);

            } catch(Exception e)
            {


                var problem = new ProblemDetails()
                {
                    Status = StatusCodes.Status500InternalServerError,
                    Title="Server Error",
                    Type= "https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1"
                };

                context.Response.StatusCode = StatusCodes.Status500InternalServerError;
               await context.Response.WriteAsJsonAsync(problem);

            }



        } 



    }
}
