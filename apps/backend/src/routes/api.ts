import { Router, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { ApiError } from '../middleware/errorHandler.js';

const router = Router();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

router.use(limiter);

// Example schema validation with Zod
const userSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  age: z.number().min(18).optional(),
});

// Example endpoints
router.get('/examples', (req: Request, res: Response) => {
  res.json({
    message: 'Example data',
    data: [
      { id: 1, title: 'Example 1' },
      { id: 2, title: 'Example 2' },
      { id: 3, title: 'Example 3' },
    ],
  });
});

router.post('/validate', (req: Request, res: Response) => {
  try {
    const validatedData = userSchema.parse(req.body);
    res.json({
      message: 'Data validated successfully',
      data: validatedData,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(400, error.errors[0].message);
    }
    throw error;
  }
});

export default router;
