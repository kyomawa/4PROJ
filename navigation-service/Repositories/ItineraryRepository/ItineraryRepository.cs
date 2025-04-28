using Microsoft.EntityFrameworkCore;
using navigation_service.Contexts;
using navigation_service.DTO.ItineraryDTO;
using navigation_service.Models;
namespace navigation_service.Repositories.ItineraryRepository
{
    public class ItineraryRepository(DataContext context) : InterfaceItineraryRepository
    {
        public async Task<UserItinerary> GetUserItineraries(Guid userId)
        {
            var userItinerary = await context.UserItinerary
                .Where(i => i.UserId == userId)
                .Include(i => i.Itineraries)
                .FirstOrDefaultAsync();

            return userItinerary;
        }

        public async Task<Itinerary> GetById(Guid itineraryId)
        {
            var itinerary = await context.Itinerary
                .Include(i => i.UserItinerary)
                .FirstOrDefaultAsync(i => i.Id == itineraryId);

            return itinerary;
        }

        public async Task<Itinerary> Save(Guid userId, CreateItineraryDto createItineraryDto)
        {
            var userItinerary = await context.UserItinerary
                .Include(u => u.Itineraries)
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (userItinerary == null)
            {
                userItinerary = new UserItinerary
                {
                    UserId = userId,
                    Itineraries = new List<Itinerary>()
                };

                await context.UserItinerary.AddAsync(userItinerary);
            }

            var itinerary = new Itinerary
            {
                Departure = createItineraryDto.Departure,
                DepartureLon = createItineraryDto.DepartureLon,
                DepartureLat = createItineraryDto.DepartureLat,
                Arrival = createItineraryDto.Arrival,
                ArrivalLon = createItineraryDto.ArrivalLon,
                ArrivalLat = createItineraryDto.ArrivalLat,
                TravelMode = createItineraryDto.TravelMode,
                Distance = createItineraryDto.Distance,
                Duration = createItineraryDto.Duration,
                UserItinerary = userItinerary
            };

            userItinerary.Itineraries.Add(itinerary);

            await context.SaveChangesAsync();

            return itinerary;
        }

        public async Task<Itinerary> Delete(Itinerary itinerary)
        {
            if (itinerary.UserItinerary == null)
            {
                throw new Exception("UserItinerary is null.");
            }

            context.Itinerary.Remove(itinerary);
            await context.SaveChangesAsync();

            var hasOtherItineraries = await context.Itinerary
                .AnyAsync(i => i.UserItinerary.Id == itinerary.UserItinerary.Id);

            if (!hasOtherItineraries)
            {
                context.UserItinerary.Remove(itinerary.UserItinerary);
                await context.SaveChangesAsync();
            }

            return itinerary;
        }
    }
}
