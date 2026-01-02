using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class Card
    {
        public int Id { get; set; }

        public string FrontText { get; set; } = null!;
        public string BackText { get; set; } = null!;

        public int Order { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Foreign key
        public int DeckId { get; set; }

        // Navigation property
        public Deck Deck { get; set; } = null!;
    }
}
