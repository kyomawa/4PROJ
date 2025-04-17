using incident_service.Enums;
using System.Text.Json.Serialization;

namespace incident_service.DTO.Vote
{
    public class VoteDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public ReactionType Reaction { get; set; }
    }
}
