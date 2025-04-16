namespace auth_service.Services.EncryptionService
{
    public interface IEncryptionService
    {
        public string GenerateToken(Guid id, string role);
        public string EncryptPassword(string password);
    }
}
