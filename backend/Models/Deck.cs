using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class Deck
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Foreign key
        public int UserId { get; set; }

        // Navigation property
        public User User { get; set; } = null!;

        // Cards contained in this deck
        public ICollection<Card> Cards { get; set; } = new List<Card>();
    }
}
