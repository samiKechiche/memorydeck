using backend.Data;
using backend.DTOs.Decks;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DeckController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DeckController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/deck
        [HttpPost]
        public async Task<IActionResult> CreateDeck(CreateDeckRequest request)
        {
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null)
                return NotFound("User not found");

            var deck = new Deck
            {
                Name = request.Name,
                UserId = request.UserId
            };

            _context.Decks.Add(deck);
            await _context.SaveChangesAsync();

            var response = new DeckResponse
            {
                Id = deck.Id,
                Name = deck.Name
            };

            return Ok(response);
        }

        // GET: api/deck/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserDecks(int userId)
        {
            var decks = await _context.Decks
                .Where(d => d.UserId == userId)
                .Select(d => new DeckResponse
                {
                    Id = d.Id,
                    Name = d.Name,
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt
                })
                .ToListAsync();

            return Ok(decks);
        }


        // GET: api/deck/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDeck(int id)
        {
            var deck = await _context.Decks
                .Include(d => d.User)
                .Include(d => d.Cards)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (deck == null)
                return NotFound("Deck not found");

            return Ok(new
            {
                deck.Id,
                deck.Name,
                deck.CreatedAt,
                deck.UpdatedAt,   
                Owner = deck.User.Username,
                CardCount = deck.Cards.Count
            });

        }


        // PUT: api/deck/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDeck(int id, UpdateDeckRequest request)
        {
            var deck = await _context.Decks.FindAsync(id);
            if (deck == null)
                return NotFound("Deck not found");

            deck.Name = request.Name;
            deck.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new DeckResponse
            {
                Id = deck.Id,
                Name = deck.Name
            });
        }

        // DELETE: api/deck/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDeck(int id)
        {
            var deck = await _context.Decks.FindAsync(id);
            if (deck == null)
                return NotFound("Deck not found");

            _context.Decks.Remove(deck);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
