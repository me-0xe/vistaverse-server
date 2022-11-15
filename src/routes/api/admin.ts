import express, { Request, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';

const router = express.Router();

// TODO: Route protection

// @route   GET api/token-quantity
// @desc    Get token quantity
// @access  Public
router.get('/token-quantity', async (req: Request, res: Response) => {
  try {
    const data = 'token quantity placeholder'
    res.json(data);
  } catch (err: any) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
});

// @route   GET api/balance
// @desc    Get balance
// @access  Public
router.get('/balance', async (req: Request, res: Response) => {
  try {
    const data = 'balance placeholder'
    res.json(data);
  } catch (err: any) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
});

// @route   POST api/balance
// @desc    Get balance quantity
// @access  Private (but not really)
router.post('/transfer', async (req: Request, res: Response) => {
  try {
    const data = 'transfer placeholder'
    res.json(data);
  } catch (err: any) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
});

export default router;
