import { ethers } from 'ethers';
import { alchemyClient } from './../../../config/alchemy';
import express, { Request, Response } from 'express';
import HttpStatusCodes from 'http-status-codes';
const abi = require('../../../config/abi.json');

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

// @route   POST api/transfer?contractId={contractId}&vip={boolean}&accountId={id}
// @desc    Get balance quantity
// @access  Private (but not really)
router.get('/transfer', async (req: Request, res: Response) => {
  try {
    const contractAddress = req.query['address'];
    const accountId = req.query['accountId'];

    if(typeof contractAddress !== 'string' || typeof accountId !== 'string' ) return res.status(HttpStatusCodes.BAD_REQUEST).send('Invalid request')

    const nfts = await alchemyClient.nft.getNftsForOwner(process.env.VISTA_CINEMEX_PUBLIC_KEY)
    const nftsByAddress = nfts.ownedNfts.filter(nft => nft.contract.address === contractAddress );
    
    const ticketTypeToFind = req.query.vip === 'true' ? "VIP" : "Standard";
    
    console.log(nftsByAddress)

    const nftTokenIdToTransfer = nftsByAddress.find(
      nft => nft.rawMetadata.attributes.some(att => att.trait_type === "Ticket type" && att.value === ticketTypeToFind)
    );
 
    const alchemyProvider = new ethers.providers.AlchemyProvider("goerli", process.env.ALCHEMY_API_KEY);
    const signer = new ethers.Wallet(process.env.VISTA_CINEMEX_PRIVATE_KEY, alchemyProvider);
    const contract = await ethers.ContractFactory.getContract(contractAddress, abi, signer)
    
    const result = await contract.transferFrom(
      process.env.VISTA_CINEMEX_PUBLIC_KEY, 
      accountId,
      nftTokenIdToTransfer.tokenId
    );
    
    res.json(result);
  } catch (err: any) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
});

// @route   GET api/admin/getNftsForAccount?accountId={id}
// @desc    Get balance
// @access  Public
// @response OwnedNft[]
router.get('/getNftsForAccount', async (req: Request, res: Response) => {
  try {
    const nfts = await alchemyClient.nft.getNftsForOwner(req.query.accountId as string);
    res.json(nfts.ownedNfts);
  } catch (err: any) {
    console.error(err.message);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
});



export default router;
