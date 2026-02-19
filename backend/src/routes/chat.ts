import { Router } from 'express';
import { body, query } from 'express-validator';
import * as chatController from '@controllers/chatController';
import { authenticate } from '@middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

/**
 * GET /api/chat/messages/:userId
 * Get messages with specific user
 */
router.get(
  '/messages/:userId',
  [
    query('limit').optional().isInt({ min: 1, max: 100 }),
    query('offset').optional().isInt({ min: 0 }),
  ],
  chatController.getMessages
);

/**
 * POST /api/chat/messages
 * Send message
 */
router.post(
  '/messages',
  [
    body('recipientId').isString().notEmpty().withMessage('Recipient ID is required'),
    body('content').trim().notEmpty().withMessage('Message content is required'),
    body('attachments').optional().isArray(),
  ],
  chatController.sendMessage
);

/**
 * GET /api/chat/users
 * Get list of chat users
 */
router.get('/users', chatController.getChatUsers);

/**
 * PUT /api/chat/messages/:messageId/read
 * Mark message as read
 */
router.put('/messages/:messageId/read', chatController.markAsRead);

/**
 * DELETE /api/chat/messages/:messageId
 * Delete message
 */
router.delete('/messages/:messageId', chatController.deleteMessage);

export default router;
