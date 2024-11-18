using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.EF
{
    public class AttachmentDraw
    {
        public int Id { get; set; }
        public string WorkOrderId { get; set; } = string.Empty; 
        public string Title { get; set; } = string.Empty;
        public string? AnnotationHistory { get; set; }
        public int VersionNumber { get; set; }
        public DateTime CreatedOn { get; set; }

    }
}