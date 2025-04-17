using incident_service.Contexts;
using incident_service.DTO.BoundingBox;
using incident_service.DTO.Incident;
using incident_service.Enums;
using incident_service.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography.X509Certificates;

namespace incident_service.Repository
{
    public class IncidentRepository(DataContext context) : InterfaceIncidentRepository
    {
        public async Task<List<Incident>> GetAll()
        {
            var incidents = await context.Incidents
                .Include(i => i.Votes)
                .ToListAsync();
            return incidents;
        }
        public async Task<List<Incident>> GetByBoundingBox(BoundingBoxDto boundingBox)
        {
            var incidents = await context.Incidents
                .Where(i => i.Latitude >= boundingBox.MinLat && i.Latitude <= boundingBox.MaxLat && i.Longitude >= boundingBox.MinLon && i.Longitude <= boundingBox.MaxLon && i.Status == IncidentStatus.Active)
                .Include(i => i.Votes)
                .ToListAsync();

            return incidents;
        }

        public async Task<Incident> Get(Guid id)
        {
            var incident = await context.Incidents
                .Include(i => i.Votes)
                .FirstOrDefaultAsync(i => i.Id == id); 
            return incident;
        }

        public async Task<bool> Exist(PostIncidentDto postIncidentDto)
        {
            return await context.Incidents
                .AnyAsync(i => i.Type == postIncidentDto.Type
                            && i.Latitude == postIncidentDto.Latitude
                            && i.Longitude == postIncidentDto.Longitude);
        }

        public async Task<Incident> Disable(Incident incident)
        {
            incident.Status = IncidentStatus.Inactive;
            await context.SaveChangesAsync();
            return incident;
        }

        public async Task<Incident> Create(PostIncidentDto postIncidentDto)
        {
            var incident = new Incident
            {
                Type = postIncidentDto.Type,
                Longitude = (double)postIncidentDto.Longitude,
                Latitude = (double)postIncidentDto.Latitude,
                CreationDate = DateTime.Now
            };

            var createdIncident = await context.Incidents.AddAsync(incident);
            await context.SaveChangesAsync();
            return createdIncident.Entity;
        }

        public async Task<Incident> Update(Incident incident, UpdateIncidentDto updateIncidentDto)
        {
            if (updateIncidentDto.Type.HasValue)
            {
                incident.Type = updateIncidentDto.Type.Value;
            }
            if (updateIncidentDto.Longitude.HasValue)
            {
                incident.Longitude = updateIncidentDto.Longitude.Value;
            }
            if (updateIncidentDto.Latitude.HasValue)
            {
                incident.Latitude = updateIncidentDto.Latitude.Value;
            }
            if (updateIncidentDto.Status.HasValue)
            {
                incident.Status = updateIncidentDto.Status.Value;
            }
            await context.SaveChangesAsync();
            return incident;
        }

        public async Task<Incident> Delete(Incident incident)
        {
            var removedIncident = context.Incidents.Remove(incident);
            await context.SaveChangesAsync();
            return removedIncident.Entity;
        }
        public async Task<List<UserIncidentVote>> GetAllVotesOnIncident(Incident incident)
        {
            return await context.UserIncidentVotes
                .Where(v => v.IncidentId == incident.Id)
                .ToListAsync();
        }

        public async Task<UserIncidentVote> GetVoteByUserOnIncident(Incident incident, Guid userId)
        {
            return await context.UserIncidentVotes
                .FirstOrDefaultAsync(v => v.IncidentId == incident.Id && v.UserId == userId);
        }

        public async Task<UserIncidentVote> CreateUserVoteOnIncident(Incident incident, Guid userId, ReactionType reaction)
        {
            var vote = new UserIncidentVote
            {
                IncidentId = incident.Id,
                UserId = userId,
                Reaction = reaction
            };

            await context.UserIncidentVotes.AddAsync(vote);
            await context.SaveChangesAsync();
            return vote;
        }

        public async Task<UserIncidentVote> UpdateUserVoteOnIncident(UserIncidentVote vote, ReactionType reaction)
        {
            vote.Reaction = reaction;
            await context.SaveChangesAsync();

            return vote;
        }
        public async Task<UserIncidentVote> DeleteUserVoteOnIncident(UserIncidentVote vote)
        {
            context.UserIncidentVotes.Remove(vote);
            await context.SaveChangesAsync();

            return vote;
        }
    }
}
