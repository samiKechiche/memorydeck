using backend.Data;
using backend.DTOs.PracticeSessions;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PracticeSessionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PracticeSessionController(AppDbContext context)
        {
            _context = context;
        }

        // ---------------- START SESSION ----------------
        [HttpPost("start")]
        public async Task<IActionResult> StartSession(StartPracticeSessionRequest request)
        {
            var userExists = await _context.Users.AnyAsync(u => u.Id == request.UserId);
            if (!userExists)
                return NotFound("User not found");

            var deckExists = await _context.Decks.AnyAsync(d => d.Id == request.DeckId);
            if (!deckExists)
                return NotFound("Deck not found");

            var activeSessionExists = await _context.PracticeSessions.AnyAsync(s =>
                s.UserId == request.UserId &&
                s.DeckId == request.DeckId &&
                s.EndedAt == null);

            if (activeSessionExists)
                return BadRequest("An active session already exists for this deck");

            var session = new PracticeSession
            {
                UserId = request.UserId,
                DeckId = request.DeckId,
                StartedAt = DateTime.UtcNow
            };

            _context.PracticeSessions.Add(session);
            await _context.SaveChangesAsync();

            return Ok(ToResponse(session));
        }

        // ---------------- INCREMENT COUNTS ----------------
        [HttpPut("{id}")]
        public async Task<IActionResult> IncrementSession(int id, IncrementPracticeSessionRequest request)
        {
            var session = await _context.PracticeSessions.FindAsync(id);
            if (session == null)
                return NotFound("Session not found");

            if (session.EndedAt != null)
                return BadRequest("Session already ended");

            session.CorrectCount += request.CorrectDelta;
            session.IncorrectCount += request.IncorrectDelta;
            session.SkippedCount += request.SkippedDelta;

            await _context.SaveChangesAsync();
            return Ok(ToResponse(session));
        }

        // ---------------- END SESSION ----------------
        [HttpPut("{id}/end")]
        public async Task<IActionResult> EndSession(int id)
        {
            var session = await _context.PracticeSessions.FindAsync(id);
            if (session == null)
                return NotFound("Session not found");

            if (session.EndedAt != null)
                return BadRequest("Session already ended");

            session.EndedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(ToResponse(session));
        }

        // ---------------- GET USER SESSIONS ----------------
        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserSessions(int userId)
        {
            var sessions = await _context.PracticeSessions
                .Where(s => s.UserId == userId)
                .OrderByDescending(s => s.StartedAt)
                .Select(s => ToResponse(s))
                .ToListAsync();

            return Ok(sessions);
        }

        // ---------------- DELETE SINGLE SESSION ----------------
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSession(int id)
        {
            var session = await _context.PracticeSessions.FindAsync(id);
            if (session == null)
                return NotFound("Session not found");

            _context.PracticeSessions.Remove(session);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ---------------- DELETE ALL USER SESSIONS ----------------
        [HttpDelete("user/{userId}")]
        public async Task<IActionResult> DeleteAllUserSessions(int userId)
        {
            var sessions = await _context.PracticeSessions
                .Where(s => s.UserId == userId)
                .ToListAsync();

            if (sessions.Count == 0)
                return NoContent();

            _context.PracticeSessions.RemoveRange(sessions);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ---------------- SESSION SUMMARY ----------------
        [HttpGet("{id}/summary")]
        public async Task<IActionResult> GetSessionSummary(int id)
        {
            var session = await _context.PracticeSessions.FindAsync(id);
            if (session == null)
                return NotFound("Session not found");

            if (session.EndedAt == null)
                return BadRequest("Session not finished yet");

            var durationMinutes = Math.Max(
                (session.EndedAt.Value - session.StartedAt).TotalMinutes,
                0.1
            );

            var totalAnswered =
                session.CorrectCount +
                session.IncorrectCount +
                session.SkippedCount;

            var summary = new PracticeSessionSummaryResponse
            {
                SessionId = session.Id,
                StartedAt = session.StartedAt,
                EndedAt = session.EndedAt.Value,
                DurationMinutes = Math.Round(durationMinutes, 2),

                CorrectCount = session.CorrectCount,
                IncorrectCount = session.IncorrectCount,
                SkippedCount = session.SkippedCount,

                TotalAnswered = totalAnswered,

                CorrectPercentage = totalAnswered == 0 ? 0 :
                    Math.Round(session.CorrectCount * 100.0 / totalAnswered, 2),

                IncorrectPercentage = totalAnswered == 0 ? 0 :
                    Math.Round(session.IncorrectCount * 100.0 / totalAnswered, 2),

                SkippedPercentage = totalAnswered == 0 ? 0 :
                    Math.Round(session.SkippedCount * 100.0 / totalAnswered, 2),
            };

            return Ok(summary);
        }

        // ---------------- MAPPER ----------------
        private static PracticeSessionResponse ToResponse(PracticeSession session)
        {
            var duration = session.EndedAt == null
                ? 0
                : Math.Max(
                    (session.EndedAt.Value - session.StartedAt).TotalMinutes,
                    0.1
                  );

            return new PracticeSessionResponse
            {
                Id = session.Id,
                UserId = session.UserId,
                DeckId = session.DeckId,
                StartedAt = session.StartedAt,
                EndedAt = session.EndedAt,
                DurationMinutes = Math.Round(duration, 2),
                CorrectCount = session.CorrectCount,
                IncorrectCount = session.IncorrectCount,
                SkippedCount = session.SkippedCount
            };
        }
    }
}
