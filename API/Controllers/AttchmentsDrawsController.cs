using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using API.Data;
using API.EF;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttchmentsDrawsController : ControllerBase
    {
        private readonly MarkingContext context;

        public AttchmentsDrawsController(MarkingContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public ActionResult<List<AttachmentDraw>> GetDraws()
        {
            var draws = context.AttachmentDraws.ToList();
            return Ok(draws);
        }

        [HttpGet("GetDrawsById")]
        public ActionResult<string?> GetDrawsById(int id = 1)
        {
            var draws = context.AttachmentDraws
           .FirstOrDefault(x => x.Id == id)?
           .AnnotationHistory;

            if (draws == null)
            {
                return NotFound("Annotation history not found.");
            }

            //string decodedXfdf = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(draws));
            return Ok(draws);
        }

        [HttpPost("SaveDraws")]
        public async Task<ActionResult<string>> SaveDraws([FromQuery] int id)
        {
            try
            {
                string xfdfData;
                using (var reader = new StreamReader(Request.Body))
                {
                    xfdfData = await reader.ReadToEndAsync();
                }

                var attached = context.AttachmentDraws.FirstOrDefault(x => x.Id == id);
                if (attached != null)
                {
                    attached.AnnotationHistory = xfdfData;
                    context.SaveChanges();
                }
                else
                {
                    return NotFound("AttachmentDraw not found.");
                }

                return Ok("Data processed and saved successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}