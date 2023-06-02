import React from 'react';
import { useContract, useEnglishAuctionWinningBid, useMinimumNextBid } from '@thirdweb-dev/react';

type MinBidProps = {
  contractAddress: string;
  listingId: string;
};

export default function MinBid({ contractAddress, listingId }: MinBidProps) {
  const { contract } = useContract(contractAddress, 'marketplace-v3');
  const { data, isLoading } = useEnglishAuctionWinningBid(contract, listingId);

  // Render the component
  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <p>Highest Bid: {data?.bidAmountCurrencyValue.displayValue}  ETH  Address: {data?.bidderAddress}</p>
      )}
    </div>
  );
}


