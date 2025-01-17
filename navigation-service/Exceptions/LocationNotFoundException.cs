using navigation_service.DTO;

namespace navigation_service.Exceptions
{
    public class LocationNotFoundException : Exception
    {
        public int StatusCode { get; }
        public LocationNotFoundException(string location, string type)
            : base($"The {type} {location} could not be found.")
        {
            StatusCode = 404;
        }

        public LocationNotFoundException(string message) : base(message)
        {
        }

        public LocationNotFoundException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
