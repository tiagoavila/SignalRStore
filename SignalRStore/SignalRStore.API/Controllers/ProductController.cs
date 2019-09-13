using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalRStore.API.HubConfig;
using SignalRStore.API.VirtualDataLayer;

namespace SignalRStore.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private IHubContext<ProductHub> _hub;

        public ProductController(IHubContext<ProductHub> hub)
        {
            _hub = hub;
        }

        // GET: api/Product
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public IActionResult GetAll()
        {
            return Ok(ProductRepository.GetAll());
        }

        // GET: api/Product/5
        [HttpGet("{id}", Name = "Get")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public IActionResult Get(Guid id)
        {
            var product = ProductRepository.GetById(id);
            if (product != null)
            {
                return Ok(product);
            }

            return NotFound();
        }

        // PUT: api/Product/5
        [HttpPut("{id}/{quantityToUpdate}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Put(Guid id, int quantityToUpdate)
        {
            var canUpdate = ProductRepository.UpdateQuantity(id, quantityToUpdate);
            if (canUpdate)
            {
                var updatedProduct = ProductRepository.GetById(id);

                await _hub.Clients.All.SendAsync($"ProductStock-{updatedProduct.Id}", updatedProduct.Quantity);

                return NoContent();
            }

            return BadRequest();
        }
    }
}
