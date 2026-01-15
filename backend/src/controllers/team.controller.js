const Team = require('../models/team.model');
const User = require('../models/user.model');
const Tournament = require('../models/tournament.model');
const Match = require('../models/match.model');

/**
 * Create a new team
 */
exports.createTeam = async (req, res, next) => {
  try {
    const { name, description, sport, captain, members, location } = req.body;
    
    // Validate captain exists
    const captainUser = await User.findById(captain);
    if (!captainUser) {
      return res.status(404).json({
        success: false,
        message: 'Captain user not found'
      });
    }

    // Validate members exist
    if (members && members.length > 0) {
      const users = await User.find({ _id: { $in: members } });
      if (users.length !== members.length) {
        return res.status(400).json({
          success: false,
          message: 'Some members not found'
        });
      }
    }

    // Create team
    const team = await Team.create({
      name,
      description,
      sport,
      owner: req.user.id,
      captain,
      members: members ? members.map(userId => ({ userId })) : [],
      location
    });

    res.status(201).json({
      success: true,
      data: team
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get user teams
 */
exports.getUserTeams = async (req, res, next) => {
  try {
    // Get teams where user is owner
    const ownedTeams = await Team.find({ owner: req.user.id })
      .populate('captain', 'name mobile')
      .populate('members.userId', 'name mobile')
      .sort({ createdAt: -1 });

    // Get teams where user is captain
    const captainedTeams = await Team.find({ 
      captain: req.user.id,
      owner: { $ne: req.user.id } // Avoid duplicates
    })
      .populate('captain', 'name mobile')
      .populate('members.userId', 'name mobile')
      .sort({ createdAt: -1 });

    // Get teams where user is a member
    const memberTeams = await Team.find({ 
      'members.userId': req.user.id,
      owner: { $ne: req.user.id },
      captain: { $ne: req.user.id } // Avoid duplicates
    })
      .populate('captain', 'name mobile')
      .populate('members.userId', 'name mobile')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        owned: ownedTeams,
        captained: captainedTeams,
        member: memberTeams
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
 * Get team details
 */
exports.getTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const team = await Team.findById(id)
      .populate('owner', 'name mobile')
      .populate('captain', 'name mobile')
      .populate('coach', 'name mobile')
      .populate('members.userId', 'name mobile')
      .populate('tournamentHistory.tournamentId', 'name category level');

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user can view this team
    const isMember = team.members.some(member => member.userId.toString() === req.user.id);
    const isOwner = team.owner.toString() === req.user.id;
    const isCaptain = team.captain.toString() === req.user.id;
    const canView = isMember || isOwner || isCaptain || team.visibility === 'public';

    if (!canView) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this team'
      });
    }

    // Get team's recent matches
    const recentMatches = await Match.find({ 
      $or: [
        { 'teams.team1': id },
        { 'teams.team2': id }
      ]
    })
    .sort({ 'schedule.date': -1 })
    .limit(10);

    const teamData = {
      ...team.toObject(),
      recentMatches,
      stats: {
        wins: team.stats.wins,
        losses: team.stats.losses,
        draws: team.stats.draws,
        matchesPlayed: team.stats.matchesPlayed,
        winRate: team.stats.matchesPlayed > 0 ? 
          Math.round((team.stats.wins / team.stats.matchesPlayed) * 100) : 0
      }
    };

    res.status(200).json({
      success: true,
      data: teamData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update team
 */
exports.updateTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user is owner
    if (team.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to modify this team'
      });
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
    .populate('captain', 'name mobile')
    .populate('members.userId', 'name mobile');

    res.status(200).json({
      success: true,
      data: updatedTeam
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Add member to team
 */
exports.addMember = async (req, res, next) => {
  try {
    const { id } = req.params; // team id
    const { userId, role = 'player' } = req.body;
    
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user is owner or captain
    const isOwner = team.owner.toString() === req.user.id;
    const isCaptain = team.captain.toString() === req.user.id;
    
    if (!isOwner && !isCaptain) {
      return res.status(403).json({
        success: false,
        message: 'Only owner or captain can add members'
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is already a member
    const isMember = team.members.some(member => member.userId.toString() === userId);
    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this team'
      });
    }

    // Check team size limit
    if (team.settings.maxMembers && team.members.length >= team.settings.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'Team has reached maximum member limit'
      });
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      id,
      {
        $push: {
          members: {
            userId,
            role,
            joinedAt: new Date(),
            status: 'active'
          }
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedTeam
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Remove member from team
 */
exports.removeMember = async (req, res, next) => {
  try {
    const { id } = req.params; // team id
    const { userId } = req.body;
    
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user is owner or captain
    const isOwner = team.owner.toString() === req.user.id;
    const isCaptain = team.captain.toString() === req.user.id;
    
    if (!isOwner && !isCaptain) {
      return res.status(403).json({
        success: false,
        message: 'Only owner or captain can remove members'
      });
    }

    // Prevent removing the captain unless it's the owner
    const member = team.members.find(m => m.userId.toString() === userId);
    if (member && member.role === 'captain' && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Only owner can remove captain'
      });
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      id,
      {
        $pull: {
          members: { userId }
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedTeam
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update member role
 */
exports.updateMemberRole = async (req, res, next) => {
  try {
    const { id } = req.params; // team id
    const { userId, role } = req.body;
    
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }

    // Check if user is owner
    if (team.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Only owner can update member roles'
      });
    }

    // Update member role
    const updatedTeam = await Team.findOneAndUpdate(
      { _id: id, 'members.userId': userId },
      { $set: { 'members.$.role': role } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedTeam
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get teams by sport and location
 */
exports.getTeamsBySportAndLocation = async (req, res, next) => {
  try {
    const { sport, location, city, state } = req.query;
    
    let query = { isActive: true };
    
    if (sport) {
      query.sport = sport;
    }
    
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    
    if (state) {
      query['location.state'] = new RegExp(state, 'i');
    }
    
    // Add location-based query if coordinates are provided
    if (location) {
      try {
        const [lat, lng] = location.split(',').map(Number);
        if (isNaN(lat) || isNaN(lng)) {
          return res.status(400).json({
            success: false,
            message: 'Invalid coordinates format. Expected: lat,lng'
          });
        }
        
        const distance = req.query.distance ? Number(req.query.distance) : 50; // default 50km
        const radiusInRadians = distance / 6378.1; // Earth's radius in km

        query['location.coordinates'] = {
          $geoWithin: {
            $centerSphere: [
              [lng, lat],
              radiusInRadians
            ]
          }
        };
      } catch (error) {
        console.error('Error parsing location:', error);
        // Continue without location filter
      }
    }
    
    const teams = await Team.find(query)
      .populate('captain', 'name mobile')
      .populate('members.userId', 'name')
      .sort({ 'stats.rating': -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Aliases for route compatibility
exports.getTeams = exports.getUserTeams;
exports.deleteTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      });
    }
    
    // Check if user is owner
    if (team.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this team'
      });
    }
    
    await Team.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Team deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.addPlayer = exports.addMember;
exports.removePlayer = exports.removeMember;
exports.updatePlayerRole = exports.updateMemberRole;

module.exports = exports;