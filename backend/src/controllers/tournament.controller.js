const Tournament = require('../models/tournament.model');
const Team = require('../models/team.model');
const Match = require('../models/match.model');
const User = require('../models/user.model');
const Booking = require('../models/booking.model');

/**
 * Create a new tournament
 */
exports.createTournament = async (req, res, next) => {
  try {
    const tournamentData = req.body;
    
    // Validate organizer
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate tournament ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    const tournamentId = `TRN-${timestamp}-${random}`.toUpperCase();

    // Create tournament
    const tournament = await Tournament.create({
      ...tournamentData,
      organizer: req.user.id
    });

    res.status(201).json({
      success: true,
      data: tournament
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get tournaments with filters
 */
exports.getTournaments = async (req, res, next) => {
  try {
    const { category, level, location, status, dateRange } = req.query;
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    if (level) {
      query.level = level;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (dateRange) {
      const [startDate, endDate] = dateRange.split(',');
      if (startDate) query['dates.tournamentStart'] = { $gte: new Date(startDate) };
      if (endDate) query['dates.tournamentEnd'] = { $lte: new Date(endDate) };
    }
    
    // Add location-based query if coordinates are provided
    if (location) {
      const [lat, lng] = location.split(',').map(Number);
      const distance = req.query.distance || 50; // default 50km
      const radiusInRadians = distance / 6378.1; // Earth's radius in km

      query['location.coordinates'] = {
        $geoWithin: {
          $centerSphere: [
            [lng, lat],
            radiusInRadians
          ]
        }
      };
    }
    
    const tournaments = await Tournament.find(query)
      .populate('organizer', 'name mobile')
      .sort({ 'dates.tournamentStart': 1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: tournaments.length,
      data: tournaments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get tournament details
 */
exports.getTournament = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const tournament = await Tournament.findById(id)
      .populate('organizer', 'name mobile')
      .populate('teams.teamId', 'name sport')
      .populate('teams.captain', 'name mobile');

    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Get tournament matches
    const matches = await Match.find({ tournamentId: id })
      .populate('teams.team1', 'name')
      .populate('teams.team2', 'name');

    const tournamentData = {
      ...tournament.toObject(),
      matches
    };

    res.status(200).json({
      success: true,
      data: tournamentData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Register team for tournament
 */
exports.registerTeamForTournament = async (req, res, next) => {
  try {
    const { id } = req.params; // tournament id
    const { teamId } = req.body;
    
    // Verify tournament exists
    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Verify team exists and user has permission
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user is team owner or captain
    if (team.owner.toString() !== req.user.id && team.captain.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to register this team'
      });
    }

    // Check if tournament registration is open
    if (tournament.dates.registrationEnd && new Date() > tournament.dates.registrationEnd) {
      return res.status(400).json({
        success: false,
        message: 'Registration period has ended'
      });
    }

    // Check if tournament is full
    if (tournament.registration.maxTeams && tournament.teams.length >= tournament.registration.maxTeams) {
      return res.status(400).json({
        success: false,
        message: 'Tournament is full'
      });
    }

    // Check if team is already registered
    const existingRegistration = tournament.teams.find(t => t.teamId.toString() === teamId);
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'Team already registered for this tournament'
      });
    }

    // Register team
    const updatedTournament = await Tournament.findByIdAndUpdate(
      id,
      {
        $push: {
          teams: {
            teamId,
            captain: team.captain,
            members: team.members.map(m => m.userId),
            registrationDate: new Date(),
            status: 'pending' // Pending approval if required
          }
        },
        $inc: { 'registration.currentTeams': 1 }
      },
      { new: true }
    );

    // Update team's tournament history
    await Team.findByIdAndUpdate(
      teamId,
      {
        $push: {
          tournamentHistory: {
            tournamentId: id,
            tournamentName: tournament.name,
            date: new Date()
          }
        }
      }
    );

    res.status(200).json({
      success: true,
      data: updatedTournament
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get user tournaments
 */
exports.getUserTournaments = async (req, res, next) => {
  try {
    // Find tournaments where user is organizer
    const organizedTournaments = await Tournament.find({ organizer: req.user.id })
      .sort({ createdAt: -1 });

    // Find tournaments where user's teams are participating
    const userTeams = await Team.find({
      $or: [
        { owner: req.user.id },
        { captain: req.user.id },
        { 'members.userId': req.user.id }
      ]
    });

    const teamIds = userTeams.map(team => team._id);
    const participatingTournaments = await Tournament.find({
      'teams.teamId': { $in: teamIds }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        organized: organizedTournaments,
        participating: participatingTournaments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update tournament status
 */
exports.updateTournamentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['draft', 'active', 'completed', 'cancelled', 'archived'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }
    
    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Verify user is organizer
    if (tournament.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to modify this tournament'
      });
    }

    const updatedTournament = await Tournament.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedTournament
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Generate tournament brackets
 */
exports.generateBrackets = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type } = req.body; // knockout, league, etc.
    
    const tournament = await Tournament.findById(id);
    if (!tournament) {
      return res.status(404).json({
        success: false,
        message: 'Tournament not found'
      });
    }

    // Verify user is organizer
    if (tournament.organizer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to modify this tournament'
      });
    }

    // Check if tournament has enough teams
    if (tournament.teams.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Not enough teams to generate brackets'
      });
    }

    // Generate bracket structure based on type
    let bracketStructure;
    if (type === 'knockout') {
      bracketStructure = generateKnockoutBracket(tournament.teams);
    } else if (type === 'league') {
      bracketStructure = generateLeagueBracket(tournament.teams);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid bracket type'
      });
    }

    // Update tournament with bracket structure
    const updatedTournament = await Tournament.findByIdAndUpdate(
      id,
      {
        'brackets.type': type,
        'brackets.structure': bracketStructure,
        'brackets.currentRound': 'Round 1',
        'status': 'active'
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedTournament
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Generate knockout bracket
 */
function generateKnockoutBracket(teams) {
  // Ensure we have a power of 2 number of teams (pad with byes if needed)
  const paddedTeams = [...teams];
  const nextPowerOfTwo = Math.pow(2, Math.ceil(Math.log2(teams.length)));
  
  // Pad with byes if necessary
  while (paddedTeams.length < nextPowerOfTwo) {
    paddedTeams.push(null); // Represents a bye
  }
  
  // Shuffle teams
  for (let i = paddedTeams.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [paddedTeams[i], paddedTeams[j]] = [paddedTeams[j], paddedTeams[i]];
  }
  
  // Create bracket structure
  const bracket = {
    roundOf: nextPowerOfTwo,
    rounds: []
  };
  
  let currentRound = 1;
  let roundTeams = [...paddedTeams];
  
  while (roundTeams.length > 1) {
    const matches = [];
    for (let i = 0; i < roundTeams.length; i += 2) {
      matches.push({
        matchNumber: `R${currentRound}-M${i/2 + 1}`,
        teams: [roundTeams[i], roundTeams[i + 1]],
        completed: false
      });
    }
    
    bracket.rounds.push({
      round: currentRound,
      matches
    });
    
    // For next round, we'll have half the teams
    roundTeams = Array(Math.ceil(roundTeams.length / 2)).fill(null);
    currentRound++;
  }
  
  return bracket;
}

/**
 * Generate league bracket (round-robin)
 */
function generateLeagueBracket(teams) {
  const matches = [];
  const teamList = teams.map(t => t.teamId);
  
  // Create matches for each team against every other team
  for (let i = 0; i < teamList.length; i++) {
    for (let j = i + 1; j < teamList.length; j++) {
      matches.push({
        teams: [teamList[i], teamList[j]],
        completed: false
      });
    }
  }
  
  return {
    type: 'round-robin',
    matches,
    totalMatches: matches.length
  };
}

module.exports = exports;