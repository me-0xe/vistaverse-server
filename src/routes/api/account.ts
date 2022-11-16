import { alchemyClient } from '../../../config/alchemy';
import express, { Request, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';

const router = express.Router();

// TODO: Route protection

// @route   GET api/admin/getNftsForAccount?accountId={id}
// @desc    Get balance
// @access  Public
router.get('/get-all-nfts', async (req: Request, res: Response) => {
  try {
    const accountId = req.query['accountId'];
    if(typeof accountId !== 'string' ) return res.status(HttpStatusCodes.BAD_REQUEST).send('Invalid accountId')
    
    const ownedNftsResponse = await alchemyClient.nft.getNftsForOwner(accountId);

    res.json(ownedNftsResponse);
  } catch (err: any) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
});





export default router;
