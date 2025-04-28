using System.ComponentModel.DataAnnotations;

namespace navigation_service.DTO.ItineraryDTO
{
    public class ItineraryQueryParams
    {
        [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180")]
        [Required(ErrorMessage = "Departure longitude is mandatory (DepartureLon)")]
        public double DepartureLon { get; set; }

        [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90")]
        [Required(ErrorMessage = "Departure latitude is mandatory (DepartureLat)")]
        public double DepartureLat { get; set; }

        [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180")]
        [Required(ErrorMessage = "Arrival longitude is mandatory (ArrivalLon)")] 
        public double ArrivalLon { get; set; }

        [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90")]
        [Required(ErrorMessage = "Arrival latitude is mandatory (ArrivalLat)")]
        public double ArrivalLat { get; set; }

        [Required(ErrorMessage = "The travel method is mandatory (TravelMethod)")]
        [RegularExpression("^(car|bike|foot|train)$", ErrorMessage = "TravelMethod should be 'car', 'bike', 'foot', or 'train'")]
        public string TravelMethod { get; set; }

        [Required(ErrorMessage = "The type of route is mandatory (RouteType)")]
        [RegularExpression("^(fastest|shortest|eco|thrilling)$", ErrorMessage = "RouteType should be 'fastest', 'shortest', 'eco', or 'thrilling'")]
        public string RouteType { get; set; }

        [Required(ErrorMessage = "AvoidTollRoads is mandatory")]
        public bool AvoidTollRoads { get; set; }
    }
}
