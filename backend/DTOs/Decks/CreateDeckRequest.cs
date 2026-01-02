namespace backend.DTOs.Decks
{
    public class CreateDeckRequest
    {
        public int UserId { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
