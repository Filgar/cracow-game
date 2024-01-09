using Inzynierka.Models;
using Microsoft.EntityFrameworkCore;

namespace Inzynierka
{
    public class DbConnector : DbContext
    {
        public DbConnector (DbContextOptions<DbConnector> options) : base(options) { }
        public DbSet<UrbanObject> UrbanObjects { get; set; }
        public DbSet<District> Districts { get; set; }
    }
}
