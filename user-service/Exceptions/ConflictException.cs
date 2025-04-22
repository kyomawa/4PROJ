namespace user_service.Exceptions
{
    public class ConflictException : Exception
    {
        public ConflictException(string message = "A conflict occurred.") : base(message) { }
    }
}
