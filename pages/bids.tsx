import React, { useEffect, useState } from 'react';
import { useContract, useContractEvents } from '@thirdweb-dev/react';

const YourComponent: React.FC = () => {
  const { contract, isLoading: loadingContract } = useContract(
    '0x0Aab76D12f0436c9E2C46F0C0F8406F616CeF5cc',
    'marketplace-v3'
  );

  const { data: allBids, isLoading: loadingBids } = useContractEvents(
    contract,
    'NewBid'
  );

  const [latestBids, setLatestBids] = useState<Record<string, any>>({});

  useEffect(() => {
    if (allBids) {
      const latestBidsByAuctionId: Record<string, any> = {};

      allBids.forEach((bid: any) => {
        const auctionId = bid.data.auctionId._hex;
        if (!latestBidsByAuctionId[auctionId]) {
          latestBidsByAuctionId[auctionId] = bid;
        } else {
          const existingBid = latestBidsByAuctionId[auctionId];
          if (bid.blockNumber > existingBid.blockNumber) {
            latestBidsByAuctionId[auctionId] = bid;
          }
        }
      });

      setLatestBids(latestBidsByAuctionId);
    }
  }, [allBids]);

  const auctionId10 = '0x0a'; // auctionId 10 in hex format

  return (
    <div>
      {loadingBids ? (
        <p>Loading bids...</p>
      ) : (
        <div>
          <h3>New Bids </h3>
          {Object.values(latestBids).map((bid: any) => (
            <div key={bid.transaction.transactionHash}>
              <p>
                Highest Bidder: {bid.data.bidder} | Auction ID: {parseInt(bid.data.auctionId._hex, 16)} | Bid: {parseInt(bid.data.bidAmount._hex, 16)/1e18} ETH
              </p>
              <hr />
            </div>
          ))}
          
        </div>
      )}
    </div>
  );
};

export default YourComponent;
