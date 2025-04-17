using System.Net.Http;
using System.Text.Json.Nodes;
using System.Text.Json;
using incident_service.DTO.Incident;
using incident_service.Repository;
using incident_service.Enums;
using AutoMapper;
using incident_service.Models;
using incident_service.Exceptions;
using incident_service.DTO.BoundingBox;
using System.Security.Claims;
using System;
using Microsoft.AspNetCore.Http.HttpResults;
using System.ComponentModel;
using incident_service.DTO.Vote;

namespace incident_service.Services
{
    public class IncidentService(InterfaceIncidentRepository incidentRepository, IMapper mapper) : InterfaceIncidentService
    {
        private const int MaxDislikesBeforeDelete = 5; 

        public async Task<List<IncidentDto>> GetAll()
        {
            var incidents = await incidentRepository.GetAll();
            return mapper.Map<List<IncidentDto>>(incidents);
        }
        public async Task<List<IncidentDto>> GetByBoundingBox(BoundingBoxDto boundingBox)
        {
            var incidents = await incidentRepository.GetByBoundingBox(boundingBox);
            return mapper.Map<List<IncidentDto>>(incidents);
        }
        public async Task<IncidentDto> Get(Guid id)
        {
            var incident = await incidentRepository.Get(id);
            return mapper.Map<IncidentDto>(incident);
        }

        public async Task<IncidentDto> Create(PostIncidentDto postIncidentDto)
        {
            var incidentExist = await incidentRepository.Exist(postIncidentDto);

            if (incidentExist)
            {
                return null;
            }

            var incident = await incidentRepository.Create(postIncidentDto);
            return mapper.Map<IncidentDto>(incident);
        }

        public async Task<IncidentDto> Update(Guid id, UpdateIncidentDto updateIncidentDto)
        {
            var incident = await incidentRepository.Get(id);
            if (incident == null)
            {
                return null;
            }

            incident = await incidentRepository.Update(incident, updateIncidentDto);
            return mapper.Map<IncidentDto>(incident);
        }

        public async Task<IncidentDto> Vote(Guid currentUserId, Guid id, VoteIncidentDto voteIncidentDto)
        {
            var incident = await incidentRepository.Get(id);

            if (incident == null)
            {
                return null;
            }

            var userVote = await HandleUserVote(currentUserId, incident, voteIncidentDto.Reaction);
            var votesOnIncident = await incidentRepository.GetAllVotesOnIncident(incident);

            var totalLikes = votesOnIncident.Count(v => v.Reaction == ReactionType.Like);
            var totalDislikes = votesOnIncident.Count(v => v.Reaction == ReactionType.Dislike);

            if (totalDislikes >= totalLikes + MaxDislikesBeforeDelete)
            {
                incident = await incidentRepository.Disable(incident);
            }

            return mapper.Map<IncidentDto>(incident);
        }

        public async Task<IncidentDto> Delete(Guid id)
        {
            var incident = await incidentRepository.Get(id);
            if (incident == null)
            {
                return null;
            }
            var incidentDeleted = await incidentRepository.Delete(incident);
            return mapper.Map<IncidentDto>(incidentDeleted);
        }
        public async Task<IncidentDto> Enable(Guid incidentId)
        {
            var incident = await incidentRepository.Get(incidentId);
            if (incident == null)
            {
                return null;
            }
            incident = await incidentRepository.Enable(incident);

            return mapper.Map<IncidentDto>(incident);
        }
        public async Task<IncidentDto> Disable(Guid incidentId)
        {
            var incident = await incidentRepository.Get(incidentId);
            if (incident == null)
            {
                return null;
            }
            incident = await incidentRepository.Disable(incident);

            return mapper.Map<IncidentDto>(incident);
        }

        private async Task<UserIncidentVote> HandleUserVote(Guid userId, Incident incident, ReactionType reaction)
        {
            var userVote = await incidentRepository.GetVoteByUserOnIncident(incident, userId);

            if (userVote == null)
            {
                userVote = await incidentRepository.CreateUserVoteOnIncident(incident, userId, reaction);
            }

            else if (reaction == userVote.Reaction)
            {
                userVote = await incidentRepository.DeleteUserVoteOnIncident(userVote);
            }

            else if (reaction != userVote.Reaction)
            {
                userVote = await incidentRepository.UpdateUserVoteOnIncident(userVote, reaction);
            }

            return userVote;
        }
    }
}
