using CodePulse.API.Models.Domain;
using CodePulse.API.Models.DTO;
using CodePulse.API.Repositories.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CodePulse.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImagesController : ControllerBase
    {
        private readonly IImageRepository imageRepository;

        public ImagesController(IImageRepository imageRepository)
        {
            this.imageRepository = imageRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllImages()
        {
            // call image repository ti get all images
            var images = await imageRepository.GetAll();

            // convert domain model to DTO
            var response = new List<BlogImageDto>();
            foreach (var image in images)
            {
                response.Add(new BlogImageDto
                {
                    Id = image.Id,
                    Title = image.Title,
                    DateCreated = image.DateCreated,
                    FileExtension = image.FileExtension,
                    FileName = image.FileName,
                    Url = image.Url,
                });
            }
            return Ok(response);



        }

        [HttpPost]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file, [FromForm] string title)
        {
            try
            {
                ValidateFileUpload(file);

                if (ModelState.IsValid)
                {
                    // Tạo tên file duy nhất
                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + DateTime.Now.ToString("yyyyMMddHHmmss") + Path.GetExtension(file.FileName).ToLower();

                    var blogImage = new BlogImage
                    {
                        FileExtension = Path.GetExtension(file.FileName).ToLower(),
                        FileName = uniqueFileName,
                        Title = title,
                        DateCreated = DateTime.Now,
                    };

                    blogImage = await imageRepository.Upload(file, blogImage);

                    var response = new BlogImageDto
                    {
                        Id = blogImage.Id,
                        Title = blogImage.Title,
                        DateCreated = blogImage.DateCreated,
                        FileExtension = blogImage.FileExtension,
                        FileName = blogImage.FileName,
                        Url = blogImage.Url,
                    };

                    return Ok(response);
                }

                return BadRequest(ModelState);
            }
            catch (Exception ex)
            {
                // Ghi log cho ngoại lệ hoặc xử lý một cách phù hợp
                return StatusCode(500, $"Lỗi Server Nội Bộ: {ex.Message}");
            }

        }

        //private void ValidateFileUpload(IFormFile file)
        //{
        //    var allowedExtensions = new string[] { ".jpg", ".png", ".jpeg" };

        //    if (file == null || file.Length == 0)
        //    {
        //        ModelState.AddModelError("file", "File là bắt buộc");
        //        return;
        //    }

        //    if (!allowedExtensions.Contains(Path.GetExtension(file.FileName).ToLower()))
        //    {
        //        ModelState.AddModelError("file", "Định dạng file không được hỗ trợ");
        //    }

        //    if (file.Length > 10485760) // 10 MB
        //    {
        //        ModelState.AddModelError("file", "Kích thước file không được quá 10MB");
        //    }
        //}
        private void ValidateFileUpload(IFormFile file)
        {
            var allowedExtensions = new string[] { ".jpg", ".png", ".jpeg" };

            if (file == null || file.Length == 0)
            {
                ModelState.AddModelError("file", "File là bắt buộc");
                return;
            }

            // Kiểm tra đuôi tệp tin
            var fileExtension = Path.GetExtension(file.FileName).ToLower();
            if (!allowedExtensions.Contains(fileExtension))
            {
                ModelState.AddModelError("file", "Định dạng file không được hỗ trợ");
                return;
            }

            // Kiểm tra kích thước file
            if (file.Length > 10485760) // 10 MB
            {
                ModelState.AddModelError("file", "Kích thước file không được quá 10MB");
                return;
            }

            // Kiểm tra Magic Number để xác định loại tệp tin thực tế
            if (!IsValidImage(file.OpenReadStream(), fileExtension))
            {
                ModelState.AddModelError("file", "Loại file không hợp lệ");
            }
        }

        private bool IsValidImage(Stream stream, string fileExtension)
        {
            // Kiểm tra Magic Number để xác định loại tệp tin thực tế
            using (var reader = new BinaryReader(stream))
            {
                var signatures = new Dictionary<string, List<byte[]>>
        {
            { ".jpg", new List<byte[]> { new byte[] { 0xFF, 0xD8 } } },
            { ".png", new List<byte[]> { new byte[] { 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A } } },
            { ".jpeg", new List<byte[]> { new byte[] { 0xFF, 0xD8 } } }
            // Thêm các loại file khác nếu cần
        };

                var maxSignatureLength = signatures.Max(s => s.Value.Max(sig => sig.Length));

                var headerBytes = reader.ReadBytes(maxSignatureLength);

                foreach (var signature in signatures[fileExtension])
                {
                    if (headerBytes.Take(signature.Length).SequenceEqual(signature))
                    {
                        return true;
                    }
                }

                return false;
            }
        }




        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> deleteImage([FromRoute] Guid id)
        {
            try
            {
                var deleteImage = await imageRepository.DeleteImage(id);

                if (deleteImage is null)
                {
                    return NotFound($"Image with Id = {id} not found");
                }

                var reponse = new BlogImageDto
                {
                    Id = deleteImage.Id,
                    Title = deleteImage.Title,
                    DateCreated = deleteImage.DateCreated,
                    FileExtension = deleteImage.FileExtension,
                    FileName = deleteImage.FileName,
                    Url = deleteImage.Url,
                };
                return Ok(reponse);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error deleting data");
            }

        }
    }
}
