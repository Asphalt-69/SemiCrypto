import { Response } from 'express';
import ChatMessage from '@models/ChatMessage';
import User from '@models/User';
import { AppError, asyncHandler, AuthenticatedRequest } from '@middleware/errorHandler';

/**
 * Get Chat Messages
 * GET /api/chat/messages/:userId
 */
export const getMessages = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId } = req.params;
  const { limit = '50', offset = '0' } = req.query;

  // Validate user exists
  const targetUser = await User.findById(userId);
  if (!targetUser) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  const messages = await ChatMessage.find({
    $or: [
      { senderId: req.userId, recipientId: userId },
      { senderId: userId, recipientId: req.userId },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit as string))
    .skip(parseInt(offset as string))
    .populate('senderId', 'firstName lastName avatar')
    .populate('recipientId', 'firstName lastName avatar');

  // Mark messages as read
  await ChatMessage.updateMany(
    { senderId: userId, recipientId: req.userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  const total = await ChatMessage.countDocuments({
    $or: [
      { senderId: req.userId, recipientId: userId },
      { senderId: userId, recipientId: req.userId },
    ],
  });

  res.json({
    success: true,
    data: {
      messages: messages.reverse(),
      pagination: {
        total,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    },
  });
});

/**
 * Send Message
 * POST /api/chat/messages
 */
export const sendMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { recipientId, content, attachments } = req.body;

  if (!content || !content.trim()) {
    throw new AppError('Message content is required', 400, 'EMPTY_MESSAGE');
  }

  // Validate recipient exists
  const recipient = await User.findById(recipientId);
  if (!recipient) {
    throw new AppError('Recipient not found', 404, 'RECIPIENT_NOT_FOUND');
  }

  // Prevent self-messaging
  if (recipientId === req.userId) {
    throw new AppError('Cannot send message to yourself', 400, 'INVALID_RECIPIENT');
  }

  const message = await ChatMessage.create({
    senderId: req.userId,
    recipientId,
    content: content.trim(),
    attachments: attachments || [],
  });

  await message.populate('senderId', 'firstName lastName avatar');
  await message.populate('recipientId', 'firstName lastName avatar');

  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: {
      message,
    },
  });
});

/**
 * Get Chat Users (List of users with recent messages)
 * GET /api/chat/users
 */
export const getChatUsers = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  // Find all distinct users that current user has/had conversations with
  const messages = await ChatMessage.aggregate([
    {
      $match: {
        $or: [{ senderId: req.userId }, { recipientId: req.userId }],
      },
    },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ['$senderId', req.userId] },
            '$recipientId',
            '$senderId',
          ],
        },
        lastMessageTime: { $max: '$createdAt' },
        unreadCount: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ['$recipientId', req.userId] }, { $eq: ['$isRead', false] }] },
              1,
              0,
            ],
          },
        },
      },
    },
    { $sort: { lastMessageTime: -1 } },
    { $limit: 50 },
  ]);

  // Get detailed user information
  const userIds = messages.map((m) => m._id);
  const users = await User.find({ _id: { $in: userIds } }).select(
    'firstName lastName avatar email'
  );

  const chatUsers = messages.map((msg) => {
    const user = users.find((u) => u._id.toString() === msg._id.toString());
    return {
      userId: msg._id,
      user: {
        id: user?._id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        avatar: user?.avatar,
        email: user?.email,
      },
      lastMessageTime: msg.lastMessageTime,
      unreadCount: msg.unreadCount,
    };
  });

  res.json({
    success: true,
    data: {
      users: chatUsers,
      count: chatUsers.length,
    },
  });
});

/**
 * Mark Message as Read
 * PUT /api/chat/messages/:messageId/read
 */
export const markAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { messageId } = req.params;

  const message = await ChatMessage.findByIdAndUpdate(
    messageId,
    { isRead: true, readAt: new Date() },
    { new: true }
  );

  if (!message) {
    throw new AppError('Message not found', 404, 'MESSAGE_NOT_FOUND');
  }

  res.json({
    success: true,
    message: 'Message marked as read',
    data: {
      message,
    },
  });
});

/**
 * Delete Message
 * DELETE /api/chat/messages/:messageId
 */
export const deleteMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { messageId } = req.params;

  const message = await ChatMessage.findByIdAndDelete(messageId);

  if (!message) {
    throw new AppError('Message not found', 404, 'MESSAGE_NOT_FOUND');
  }

  res.json({
    success: true,
    message: 'Message deleted successfully',
  });
});
