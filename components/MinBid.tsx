import React from 'react';
import { useContract, useMinimumNextBid } from '@thirdweb-dev/react';

type MinBidProps = {
  contractAddress: string;
  listingId: string;
};

export default function MinBid({ contractAddress, listingId }: MinBidProps) {
  const { contract } = useContract(contractAddress, 'marketplace');
  const { data, isLoading } = useMinimumNextBid(contract, listingId);

  // Render the component
  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <p>Minimum Next Bid: {data?.displayValue}</p>
      )}
    </div>
  );
}


