using Microsoft.EntityFrameworkCore;

namespace DataConfiguration;


public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext( )
    {
        
    }
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {

    }
}