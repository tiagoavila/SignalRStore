using System;

namespace SignalRStore.API.Models
{
    public class Product
    {
        public Guid Id { get; set; }
        public string Title{ get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public string ImageUrl { get; set; }
    }
}
