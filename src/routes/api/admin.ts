import { alchemyClient } from './../../../config/alchemy';
import express, { Request, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';

const router = express.Router();

// TODO: Route protection

// @route   GET api/admin/token-quantity?
// @desc    Get token quantity
// @access  Public
router.get('/token-quantities', async (req: Request, res: Response) => {
  try {
    const nfts = await alchemyClient.nft.getNftsForOwner(process.env.VISTA_CINEMEX_PUBLIC_KEY)
    const vistaNfts = nfts.ownedNfts.filter(nft => nft.contract.address === req.query.address );
    
    res.json({
      standard: vistaNfts.filter(a => a.rawMetadata.attributes.some(att => att.trait_type === "Ticket type" && att.value === "Standard")).length,
      vip: vistaNfts.filter(a => a.rawMetadata.attributes.some(att => att.trait_type === "Ticket type" && att.value === "Vip")).length
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
});

// @route   GET api/admin/balance
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
