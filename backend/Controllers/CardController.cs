using backend.Data;
using backend.DTOs.Cards;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CardController(AppDbContext context)
        {
            _context = context;
        }

        // ---------------- CREATE CARD ----------------
        [HttpPost]
        public async Task<IActionResult> CreateCard(CreateCardRequest request)
        {
            var deck = await _context.Decks
                .Include(d => d.Cards)
                .FirstOrDefaultAsync(d => d.Id == request.DeckId);

            if (deck == null)
                return NotFound("Deck not found");

            var newOrder = deck.Cards.Count + 1;

            var card = new Card
            {
                FrontText = request.FrontText,
                BackText = request.BackText,
                Order = newOrder,
                DeckId = request.DeckId
            };

            _context.Cards.Add(card);
            await TouchDeckAsync(request.DeckId);
            await _context.SaveChangesAsync();

            return Ok(new CardResponse
            {
                Id = card.Id,
                FrontText = card.FrontText,
                BackText = card.BackText,
                Order = card.Order,
                DeckId = card.DeckId
            });
        }

        // ---------------- UPDATE CARD ----------------
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCard(int id, UpdateCardRequest request)
        {
            var card = await _context.Cards.FindAsync(id);
            if (card == null)
                return NotFound("Card not found");

            card.FrontText = request.FrontText;
            card.BackText = request.BackText;
            card.UpdatedAt = DateTime.UtcNow;

            await TouchDeckAsync(card.DeckId);
            await _context.SaveChangesAsync();

            return Ok(new CardResponse
            {
                Id = card.Id,
                FrontText = card.FrontText,
                BackText = card.BackText,
                Order = card.Order,
                DeckId = card.DeckId
            });
        }

        // ---------------- DELETE CARD ----------------
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCard(int id)
        {
            var card = await _context.Cards.FindAsync(id);
            if (card == null)
                return NotFound("Card not found");

            _context.Cards.Remove(card);
            await TouchDeckAsync(card.DeckId);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ---------------- REORDER CARD ----------------
        [HttpPut("{id}/reorder")]
        public async Task<IActionResult> ReorderCard(int id, ReorderCardRequest request)
        {
            var card = await _context.Cards.FindAsync(id);
            if (card == null)
                return NotFound("Card not found");

            var cards = await _context.Cards
                .Where(c => c.DeckId == card.DeckId)
                .OrderBy(c => c.Order)
                .ToListAsync();

            if (request.NewOrder < 1 || request.NewOrder > cards.Count)
                return BadRequest("Invalid order position");

            cards.Remove(card);
            cards.Insert(request.NewOrder - 1, card);

            for (int i = 0; i < cards.Count; i++)
            {
                cards[i].Order = i + 1;
            }

            await TouchDeckAsync(card.DeckId);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // ---------------- GET CARDS BY DECK ----------------
        [HttpGet("deck/{deckId}")]
        public async Task<IActionResult> GetCardsByDeck(int deckId)
        {
            var cards = await _context.Cards
                .Where(c => c.DeckId == deckId)
                .OrderBy(c => c.Order)
                .Select(c => new CardResponse
                {
                    Id = c.Id,
                    FrontText = c.FrontText,
                    BackText = c.BackText,
                    Order = c.Order,
                    DeckId = c.DeckId
                })
                .ToListAsync();

            return Ok(cards);
        }

        // ---------------- HELPER ----------------
        private async Task TouchDeckAsync(int deckId)
        {
            var deck = await _context.Decks.FindAsync(deckId);
            if (deck != null)
            {
                deck.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}
