using incident_service.Contexts;
using incident_service.DTO.BoundingBox;
using incident_service.DTO.Incident;
using incident_service.Enums;
using incident_service.Models;
using Microsoft.EntityFrameworkCore;

namespace incident_service.Repository
{
    public class IncidentRepository(DataContext context) : InterfaceIncidentRepository
    {
        public async Task<List<Incident>> GetAll()
        {
            var incidents = await context.Incidents.ToListAsync();
            return incidents;
        }
        public async Task<List<Incident>> GetByBoundingBox(BoundingBoxDto boundingBox)
        {
            var incidents = await context.Incidents
                .Where(i => i.Latitude >= boundingBox.MinLat && i.Latitude <= boundingBox.MaxLat && i.Longitude >= boundingBox.MinLon && i.Longitude <= boundingBox.MaxLon && i.Status == IncidentStatus.Active)
                .ToListAsync();

            return incidents;
        }

        public async Task<Incident> Get(Guid id)
        {
            var incident = await context.Incidents.FindAsync(id);
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

        public async Task<Incident> AddLike(Incident incident)
        {
            incident.Like++;
            await context.SaveChangesAsync();
            return incident;
        }
        public async Task<Incident> AddDislike(Incident incident)
        {
            incident.Dislike++;
            await context.SaveChangesAsync();
            return incident;
        }
        public async Task<Incident> Delete(Incident incident)
        {
            var removedIncident = context.Incidents.Remove(incident);
            await context.SaveChangesAsync();
            return removedIncident.Entity;
        }
    }
}
