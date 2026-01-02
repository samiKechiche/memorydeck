namespace backend.DTOs.Cards
{
    public class CreateCardRequest
    {
        public int DeckId { get; set; }
        public string FrontText { get; set; } = string.Empty;
        public string BackText { get; set; } = string.Empty;
    }
}
