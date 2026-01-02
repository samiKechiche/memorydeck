namespace backend.DTOs.Cards
{
    public class CardResponse
    {
        public int Id { get; set; }
        public string FrontText { get; set; } = string.Empty;
        public string BackText { get; set; } = string.Empty;
        public int Order { get; set; }
        public int DeckId { get; set; }
    }
}
