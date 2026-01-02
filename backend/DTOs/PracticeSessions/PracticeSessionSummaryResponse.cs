using System;

namespace backend.DTOs.PracticeSessions
{
    public class PracticeSessionSummaryResponse
    {
        public int SessionId { get; set; }

        public DateTime StartedAt { get; set; }
        public DateTime EndedAt { get; set; }

        public double DurationMinutes { get; set; }

        public int CorrectCount { get; set; }
        public int IncorrectCount { get; set; }
        public int SkippedCount { get; set; }

        public int TotalAnswered { get; set; }

        public double CorrectPercentage { get; set; }
        public double IncorrectPercentage { get; set; }
        public double SkippedPercentage { get; set; }


    }
}
