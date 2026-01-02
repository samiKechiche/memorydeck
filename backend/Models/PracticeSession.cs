using System;

namespace backend.Models
{
    public class PracticeSession
    {
        public int Id { get; set; }

        public DateTime StartedAt { get; set; } = DateTime.UtcNow;
        public DateTime? EndedAt { get; set; }

        public int CorrectCount { get; set; }
        public int IncorrectCount { get; set; }
        public int SkippedCount { get; set; }

        // Foreign keys
        public int UserId { get; set; }
        public int DeckId { get; set; }

        // Navigation properties
        public User User { get; set; } = null!;
        public Deck Deck { get; set; } = null!;
    }
}
