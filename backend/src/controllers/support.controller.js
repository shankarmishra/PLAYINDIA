const SupportTicket = require('../models/SupportTicket.model');
const User = require('../models/user.model');
const Admin = require('../models/Admin.model');

/**
 * Create a new support ticket
 */
exports.createTicket = async (req, res, next) => {
  try {
    const { subject, description, category, type, relatedEntity, relatedId, attachments } = req.body;
    
    // Validate required fields
    if (!subject || !description || !category || !type) {
      return res.status(400).json({
        success: false,
        message: 'Subject, description, category, and type are required'
      });
    }

    // Generate ticket ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    const ticketId = `TKT-${timestamp}-${random}`.toUpperCase();

    // Create ticket
    const ticket = await SupportTicket.create({
      ticketId,
      userId: req.user.id,
      subject,
      description,
      category,
      type,
      priority: 'medium', // Default priority
      relatedEntity,
      relatedId,
      attachments,
      status: 'open'
    });

    res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get user's support tickets
 */
exports.getUserTickets = async (req, res, next) => {
  try {
    const { status, category, priority, type, limit = 20, page = 1 } = req.query;
    
    let query = { userId: req.user.id };
    
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    if (type) {
      query.type = type;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const tickets = await SupportTicket.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SupportTicket.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tickets.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: tickets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get support ticket details
 */
exports.getTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const ticket = await SupportTicket.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Add message to ticket
 */
exports.addMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message, attachments } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const ticket = await SupportTicket.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Add message to ticket
    const updatedTicket = await SupportTicket.findByIdAndUpdate(
      id,
      {
        $push: {
          messages: {
            sender: req.user.id,
            senderRole: 'user',
            message,
            attachments: attachments || [],
            timestamp: new Date()
          }
        },
        $set: {
          status: 'in_progress',
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedTicket
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Close ticket
 */
exports.closeTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { satisfactionRating } = req.body;
    
    const ticket = await SupportTicket.findOne({
      _id: id,
      userId: req.user.id
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Update ticket status to closed
    const updatedTicket = await SupportTicket.findByIdAndUpdate(
      id,
      {
        $set: {
          status: 'closed',
          satisfactionRating: satisfactionRating || undefined,
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedTicket
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Admin: Get all tickets
 */
exports.getAllTickets = async (req, res, next) => {
  try {
    const { status, category, priority, type, assignedTo, limit = 20, page = 1 } = req.query;
    
    // Verify admin access
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (priority) {
      query.priority = priority;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (assignedTo) {
      query.assignedTo = assignedTo;
    }
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    const tickets = await SupportTicket.find(query)
      .populate('userId', 'name email mobile')
      .sort({ priority: -1, createdAt: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await SupportTicket.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tickets.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: tickets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Admin: Get ticket details
 */
exports.getTicketAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Verify admin access
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const ticket = await SupportTicket.findById(id)
      .populate('userId', 'name email mobile');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Admin: Assign ticket
 */
exports.assignTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { adminId } = req.body;
    
    // Verify admin access
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Update ticket assignment
    const updatedTicket = await SupportTicket.findByIdAndUpdate(
      id,
      {
        $set: {
          assignedTo: adminId,
          status: 'in_progress',
          updatedAt: new Date()
        }
      },
      { new: true }
    ).populate('userId', 'name email mobile');

    res.status(200).json({
      success: true,
      data: updatedTicket
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Admin: Update ticket status
 */
exports.updateTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, resolution } = req.body;
    
    const validStatuses = ['open', 'in_progress', 'resolved', 'closed', 'escalated'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Verify admin access
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Prepare update object
    const updateObj = {
      $set: {
        status,
        updatedAt: new Date()
      }
    };

    // Add resolution if ticket is being resolved or closed
    if ((status === 'resolved' || status === 'closed') && resolution) {
      updateObj.$set.resolvedBy = req.user.id;
      updateObj.$set.resolvedAt = new Date();
      updateObj.$set.resolution = resolution;
    }

    // Update ticket
    const updatedTicket = await SupportTicket.findByIdAndUpdate(
      id,
      updateObj,
      { new: true }
    ).populate('userId', 'name email mobile');

    res.status(200).json({
      success: true,
      data: updatedTicket
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Admin: Add admin message to ticket
 */
exports.addAdminMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { message, attachments } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Verify admin access
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const ticket = await SupportTicket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Add message to ticket
    const updatedTicket = await SupportTicket.findByIdAndUpdate(
      id,
      {
        $push: {
          messages: {
            sender: req.user.id,
            senderRole: 'admin',
            message,
            attachments: attachments || [],
            timestamp: new Date()
          }
        },
        $set: {
          status: 'in_progress',
          updatedAt: new Date()
        }
      },
      { new: true }
    ).populate('userId', 'name email mobile');

    res.status(200).json({
      success: true,
      data: updatedTicket
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = exports;