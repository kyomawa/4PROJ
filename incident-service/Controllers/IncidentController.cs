using incident_service.DTO.Incident;
using Microsoft.AspNetCore.Http;
using incident_service.Services;
using Microsoft.AspNetCore.Mvc;

namespace incident_service.Controllers
{
    public class IncidentController(InterfaceIncidentService incidentService) : Controller
    {
        // GET: IncidentController
        public ActionResult GetAll()
        {
            return View();
        }
        public ActionResult Get(int id)
        {
            return View();
        }

        [HttpPost]
        public ActionResult Create([FromBody] PostIncidentDto postIncidentDto)
        {
            return View();
        }


        [HttpPut("{id}")]
        public ActionResult Update([FromBody] PutIncidentDto putIncidentDto)
        {
            return View();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            return View();
        }
    }
}
