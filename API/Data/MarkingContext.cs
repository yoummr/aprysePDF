using Microsoft.EntityFrameworkCore;
using API.EF;
namespace API.Data
{
    public class MarkingContext: DbContext
    {
        public MarkingContext(DbContextOptions options):base(options)
        {
            
        }
        public DbSet<AttachmentDraw> AttachmentDraws { get; set; }
    }
}