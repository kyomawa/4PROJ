using System.ComponentModel.DataAnnotations;

namespace incident_service.DTO.BoundingBox
{
    public class BoundingBoxDto
    {
        [Required(ErrorMessage = "MinLat is mandatory")]
        public double MinLat { get; set; }

        [Required(ErrorMessage = "MaxLat is mandatory")]
        public double MaxLat { get; set; }

        [Required(ErrorMessage = "MinLon is mandatory")]
        public double MinLon { get; set; }

        [Required(ErrorMessage = "MaxLon is mandatory")]
        public double MaxLon { get; set; }
    }
}
