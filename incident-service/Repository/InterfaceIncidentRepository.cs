using incident_service.DTO.BoundingBox;
using incident_service.DTO.Incident;
using incident_service.Enums;
using incident_service.Models;

namespace incident_service.Repository
{
    public interface InterfaceIncidentRepository
    {
        public Task<List<Incident>> GetAll();
        public Task<List<Incident>> GetByBoundingBox(BoundingBoxDto boundingBox);
        public Task<Incident> Get(Guid id);
        public Task<bool> Exist(PostIncidentDto postIncidentDto);
        public Task<Incident> Enable(Incident incident);
        public Task<Incident> Disable(Incident incident);
        public Task<Incident> Create(PostIncidentDto postIncidentDto);
        public Task<Incident> Update(Incident incident, UpdateIncidentDto updateIncidentDto);
        public Task<Incident> Delete(Incident incident);
        public Task<List<UserIncidentVote>> GetAllVotesOnIncident(Incident incident);
        public Task<UserIncidentVote> GetVoteByUserOnIncident(Incident incident, Guid userId);
        public Task<UserIncidentVote> CreateUserVoteOnIncident(Incident incident, Guid userId, ReactionType reaction);
        public Task<UserIncidentVote> UpdateUserVoteOnIncident(UserIncidentVote vote, ReactionType newReaction);
        public Task<UserIncidentVote> DeleteUserVoteOnIncident(UserIncidentVote vote);

    }
}
