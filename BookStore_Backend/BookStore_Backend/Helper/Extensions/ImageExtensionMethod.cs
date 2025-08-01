using Microsoft.AspNetCore.Mvc;

namespace BookStore_Backend.Helper.Extensions
{
    public static class ImageExtensionMethod
    {
        public static string UploadImage(IFormFile file)
        {
            var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");

            if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

            var filePath = Path.Combine(folderPath, fileName);

            using var stream = new FileStream(filePath, FileMode.Create);

            file.CopyTo(stream);

            return fileName;
        }

    }
}
