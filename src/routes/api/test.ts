import { alchemyClient } from '../../../config/alchemy';
import express, { Request, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';

const router = express.Router();

// TODO: Route protection

// @route   GET api/block-number
// @desc    Just a test to see if sdk is working.
// @access  Public
router.get('/block-number', async (req: Request, res: Response) => {
  try {
    const blockHeight = await alchemyClient.core.getBlockNumber();
    res.json(blockHeight);
  } catch (err: any) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
});





export default router;
