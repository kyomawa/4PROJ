using System.Security.Cryptography;
using System.Text;

namespace user_service.Services.EncryptionService
{
    public class EncryptionService(IConfiguration configuration) : IEncryptionService
    {
        public string Decrypt(string cipherText)
        {
            using var aes = Aes.Create();
            aes.Key = Encoding.UTF8.GetBytes(configuration["Encryption:Key"]);
            aes.IV = new byte[16];

            var decryptor = aes.CreateDecryptor(aes.Key, aes.IV);
            byte[] encryptedBytes = Convert.FromBase64String(cipherText);
            byte[] decryptedBytes = decryptor.TransformFinalBlock(encryptedBytes, 0, encryptedBytes.Length);

            return Encoding.UTF8.GetString(decryptedBytes);
        }
    }
}
