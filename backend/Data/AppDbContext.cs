using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Deck> Decks { get; set; } = null!;
        public DbSet<Card> Cards { get; set; } = null!;
        public DbSet<PracticeSession> PracticeSessions { get; set; } = null!;
    }
}
