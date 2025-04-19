using System.ComponentModel.DataAnnotations;

namespace alert_service.DTO
{
    public class BoundingBoxDto
    {
        [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90")]
        [Required(ErrorMessage = "Min latitude is mandatory")]
        public double MinLat { get; set; }

        [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90")]
        [Required(ErrorMessage = "Max latitude is mandatory")]
        public double MaxLat { get; set; }

        [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180")]
        [Required(ErrorMessage = "Min longitude is mandatory")]
        public double MinLon { get; set; }

        [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180")]
        [Required(ErrorMessage = "Max longitude is mandatory")]
        public double MaxLon { get; set; }
    }
}
