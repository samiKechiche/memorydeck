namespace backend.DTOs.PracticeSessions
{
    public class IncrementPracticeSessionRequest
    {
        public int CorrectDelta { get; set; }
        public int IncorrectDelta { get; set; }
        public int SkippedDelta { get; set; }
    }
}
