using System;

namespace backend.DTOs.PracticeSessions
{
    public class PracticeSessionResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int DeckId { get; set; }

        public DateTime StartedAt { get; set; }
        public DateTime? EndedAt { get; set; }

        public double DurationMinutes { get; set; }

        public int CorrectCount { get; set; }
        public int IncorrectCount { get; set; }
        public int SkippedCount { get; set; }
    }
}
