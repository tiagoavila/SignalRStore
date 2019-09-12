using SignalRStore.API.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SignalRStore.API.VirtualDataLayer
{
    public static class ProductRepository
    {
        private static List<Product> products = new List<Product>()
        {
            new Product
            {
                Id = Guid.NewGuid(),
                Title = "Ibanez Guitar",
                Description = "Top guitar to new musicians",
                ImageUrl = "https://www.martinpallett.co.uk/wp-content/uploads/2019/01/DSC_0088.jpg",
                Price = 1200,
                Quantity = 50
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Title = "Kindle",
                Description = "e-book reader",
                ImageUrl = "https://images-na.ssl-images-amazon.com/images/I/419i0JkdTHL._SY300_QL70_.jpg",
                Price = 200,
                Quantity = 50
            }
        };

        public static List<Product> GetAll()
        {
            return products;
        }

        public static Product GetById(Guid id)
        {
            return products.FirstOrDefault(p => p.Id == id);
        }

        public static bool UpdateQuantity(Guid id, int quantityToRemove)
        {
            var productToUpdate = GetById(id);
            if (productToUpdate != null && quantityToRemove <= productToUpdate.Quantity)
            {
                productToUpdate.Quantity -= quantityToRemove;
                return true;
            }

            return false;
        }
    }
}
