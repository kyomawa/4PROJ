namespace incident_service.Exceptions
{
    public class IncidentTypeException : Exception
    {
        public IncidentTypeException() { }
        public IncidentTypeException(string message) : base(message) { }
        public IncidentTypeException(string message, Exception innerException): base(message, innerException) { }
    }
}
