const Match = require('../models/match.model');
const Tournament = require('../models/tournament.model');
const Team = require('../models/team.model');
const User = require('../models/user.model');

/**
 * Get match schedule and results
 */
exports.getMatches = async (req, res, next) => {
  try {
    const { tournamentId, teamId, status, dateRange } = req.query;
    
    let query = {};
    
    if (tournamentId) {
      query.tournamentId = tournamentId;
    }
    
    if (teamId) {
      query.$or = [
        { 'teams.team1': teamId },
        { 'teams.team2': teamId }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    if (dateRange) {
      const [startDate, endDate] = dateRange.split(',');
      if (startDate) query['schedule.date'] = { $gte: new Date(startDate) };
      if (endDate) query['schedule.date'] = { ...query['schedule.date'], $lte: new Date(endDate) };
    }
    
    const matches = await Match.find(query)
      .populate('teams.team1', 'name')
      .populate('teams.team2', 'name')
      .populate('tournamentId', 'name category')
      .sort({ 'schedule.date': 1, 'schedule.time': 1 });

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get match details
 */
exports.getMatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const match = await Match.findById(id)
      .populate('teams.team1', 'name')
      .populate('teams.team2', 'name')
      .populate('tournamentId', 'name category')
      .populate('officials.referees', 'name')
      .populate('officials.scorers', 'name');

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Create a new match (for tournament organizers)
 */
exports.createMatch = async (req, res, next) => {
  try {
    const { tournamentId, teams, schedule, location } = req.body;
    
    // Verify tournament exists and user is organizer
    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    if (tournament.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to create matches for this tournament'
      });
    }

    // Verify teams exist
    const team1 = await Team.findById(teams.team1);
    const team2 = await Team.findById(teams.team2);
    
    if (!team1 || !team2) {
      return res.status(404).json({
        success: false,
        message: 'One or both teams not found'
      });
    }

    // Generate match number
    const matchCount = await Match.countDocuments({ tournamentId });
    const matchNumber = matchCount + 1;

    // Create match
    const match = await Match.create({
      tournamentId,
      matchNumber,
      teams,
      location,
      schedule,
      status: 'scheduled'
    });

    res.status(201).json({
      success: true,
      data: match
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update match result (for referees/officials)
 */
exports.updateMatchResult = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { scores, result, events } = req.body;
    
    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Verify user is authorized to update this match
    const isTournamentOrganizer = match.tournamentId.toString() === 
      (await Tournament.findById(match.tournamentId)).organizer.toString();
      
    const isReferee = match.officials.referees && 
      match.officials.referees.some(ref => ref.toString() === req.user.id);
    
    if (!isTournamentOrganizer && !isReferee) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update match result'
      });
    }

    // Update match result
    const updatedMatch = await Match.findByIdAndUpdate(
      id,
      {
        'scores.team1': scores.team1,
        'scores.team2': scores.team2,
        result,
        'events': events,
        status: 'completed',
        'result.updatedAt': new Date()
      },
      { new: true }
    )
    .populate('teams.team1', 'name')
    .populate('teams.team2', 'name');

    // Update team stats
    await updateTeamStats(match, result);

    res.status(200).json({
      success: true,
      data: updatedMatch
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update match status (for live updates)
 */
exports.updateMatchStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['scheduled', 'live', 'completed', 'postponed', 'cancelled', 'abandoned'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Verify user is authorized
    const tournament = await Tournament.findById(match.tournamentId);
    if (tournament.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update match status'
      });
    }

    const updatedMatch = await Match.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedMatch
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Add match event (goal, foul, etc.)
 */
exports.addMatchEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type, team, player, minute, description } = req.body;
    
    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Verify user is authorized
    const tournament = await Tournament.findById(match.tournamentId);
    if (tournament.organizer.toString() !== req.user.id) {
      const isReferee = match.officials.referees && 
        match.officials.referees.some(ref => ref.toString() === req.user.id);
      if (!isReferee) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to add match events'
        });
      }
    }

    const updatedMatch = await Match.findByIdAndUpdate(
      id,
      {
        $push: {
          events: {
            type,
            team,
            player,
            minute,
            description,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedMatch
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Add live update to match
 */
exports.addLiveUpdate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message, type } = req.body;
    
    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    // Verify user is authorized
    const tournament = await Tournament.findById(match.tournamentId);
    if (tournament.organizer.toString() !== req.user.id) {
      const isReferee = match.officials.referees && 
        match.officials.referees.some(ref => ref.toString() === req.user.id);
      if (!isReferee) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to add live updates'
        });
      }
    }

    const updatedMatch = await Match.findByIdAndUpdate(
      id,
      {
        $push: {
          liveUpdates: {
            message,
            type,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedMatch
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update team stats after match completion
 */
async function updateTeamStats(match, result) {
  // Update team stats based on match result
  const team1 = await Team.findById(match.teams.team1);
  const team2 = await Team.findById(match.teams.team2);
  
  if (team1 && team2) {
    // Update team 1 stats
    await Team.findByIdAndUpdate(match.teams.team1, {
      $inc: {
        'stats.matchesPlayed': 1,
        'stats.goalsFor': match.scores.team1,
        'stats.goalsAgainst': match.scores.team2,
        'stats.goalDifference': match.scores.team1 - match.scores.team2
      },
      $push: {
        'performance.recentForm': result.winner === match.teams.team1 ? 'W' : 
                  result.winner === match.teams.team2 ? 'L' : 'D'
      }
    });
    
    // Update team 2 stats
    await Team.findByIdAndUpdate(match.teams.team2, {
      $inc: {
        'stats.matchesPlayed': 1,
        'stats.goalsFor': match.scores.team2,
        'stats.goalsAgainst': match.scores.team1,
        'stats.goalDifference': match.scores.team2 - match.scores.team1
      },
      $push: {
        'performance.recentForm': result.winner === match.teams.team2 ? 'W' : 
                  result.winner === match.teams.team1 ? 'L' : 'D'
      }
    });
    
    // Update wins/losses/draws
    if (result.winner) {
      if (result.winner.toString() === match.teams.team1.toString()) {
        await Team.findByIdAndUpdate(match.teams.team1, {
          $inc: { 'stats.wins': 1 }
        });
        await Team.findByIdAndUpdate(match.teams.team2, {
          $inc: { 'stats.losses': 1 }
        });
      } else {
        await Team.findByIdAndUpdate(match.teams.team2, {
          $inc: { 'stats.wins': 1 }
        });
        await Team.findByIdAndUpdate(match.teams.team1, {
          $inc: { 'stats.losses': 1 }
        });
      }
    } else {
      // Draw
      await Team.findByIdAndUpdate(match.teams.team1, {
        $inc: { 'stats.draws': 1 }
      });
      await Team.findByIdAndUpdate(match.teams.team2, {
        $inc: { 'stats.draws': 1 }
      });
    }
  }
}

module.exports = exports;