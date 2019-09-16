using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SignalRStore.API.HubConfig
{
    public class ProductHub : Hub
    {
        public async Task BroadcastNumber(int number)
        {
            await Clients.All.SendAsync("broadcastnumberchannel", number);
        }
    }
}
