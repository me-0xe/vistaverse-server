import { ethers } from 'ethers';
import { alchemyClient } from './../../../config/alchemy';
import express, { Request, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';
import { Contract, Utils, Wallet } from 'alchemy-sdk';
const  abi = require('../../../config/abi.json');

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

// @route   POST api/transfer?contractId={contractId}&vip={boolean}&accountId={id}
// @desc    Get balance quantity
// @access  Private (but not really)
router.get('/transfer', async (req: Request, res: Response) => {
  try {
    const nfts = await alchemyClient.nft.getNftsForOwner(process.env.VISTA_CINEMEX_PUBLIC_KEY)

    const ticketTypeToFind = req.query.vip ? "VIP" : "Standard";

    const vistaNfts = nfts.ownedNfts.filter(nft => nft.contract.address === req.query.address ).find(nft => nft.rawMetadata.
      attributes.includes(att => att.trait_type === "Ticket type" && att.value ===  ticketTypeToFind ));
    //Filter by isVip;

    const nftToMove = vistaNfts[0];
    console.log('---',nftToMove);

    // Provider
    const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);
    const signer = new ethers.Wallet(process.env.VISTA_CINEMEX_PRIVATE_KEY, alchemyProvider);
    const contract = await ethers.ContractFactory.getContract('0xcd2818ee9a42d53e1e24d8faa484b48bdbe4e93c', abi, signer)
    
    const test = await contract.transferFrom(process.env.VISTA_CINEMEX_PUBLIC_KEY, '0x2af4BCD6d84b0C9e68c2Db4394a42cf177f9f3B4',2);
    console.log(test);
    res.json(test);
  } catch (err: any) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
});

// @route   GET api/admin/getNftsForAccount?accountId={id}
// @desc    Get balance
// @access  Public
// @response OwnedNft[]



export default router;
