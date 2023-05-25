import { ConnectWallet, MediaRenderer, useContract, useValidEnglishAuctions, useMinimumNextBid, useContractEvents } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { NFT } from "@thirdweb-dev/sdk";
import MinBid from "../components/MinBid";
import styles from "../styles/Home.module.css";
import React, { useState } from "react";

const Home: NextPage = () => {
  const { contract, isLoading: loadingContract } = useContract(
    '0x0Aab76D12f0436c9E2C46F0C0F8406F616CeF5cc',
    "marketplace-v3"
  );

  const { data: auctionListing, isLoading: loadingAuction } =
    useValidEnglishAuctions(contract, {
      tokenContract: '0xfAFD72c9656018a60520DEb643c74eedA8199e2C',
    });

  const { data: bids, isLoading } = useContractEvents(contract, "NewBid");

  const [bidValues, setBidValues] = useState<Record<string, string>>({}); // State variable to hold bid values for each listing

  const handleBidChange = (listingId: string, value: string) => {
    setBidValues((prevBidValues) => ({
      ...prevBidValues,
      [listingId]: value,
    }));
  };

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>SOVRN AUCTION MARKETPLACE</h1>
        <h2>
          <ConnectWallet />
        </h2>

        {!loadingAuction ? (
          <div>
            {auctionListing &&
              auctionListing.map((nft) => {
                const listingId = nft.id;
                const bidValue = bidValues[listingId] || ""; // Retrieve the bid value for the current listing

                return (
                  <div key={listingId} className={styles.nftContainer}>
                    <div className={styles.imageContainer}>
                      <MediaRenderer
                        src={nft.asset.image}
                        height="500px"
                        width="500px"
                      />
                    </div>
                    <div className={styles.textContainer}>
                      <p>{nft.asset.name}</p>
                      <MinBid
                        contractAddress="0x0Aab76D12f0436c9E2C46F0C0F8406F616CeF5cc"
                        listingId={listingId}
                      />
                      <p>
                        <input
                          type="text"
                          value={bidValue}
                          onChange={(e) =>
                            handleBidChange(listingId, e.target.value)
                          }
                          placeholder="Enter bid value"
                        />
                        <button
                          onClick={async () => {
                            try {
                              await contract?.englishAuctions.makeBid(
                                listingId,
                                parseFloat(bidValue)
                              );
                            } catch (error) {
                              console.error(error);
                              alert(error);
                            }
                          }}
                        >
                          Make Bid
                        </button>
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </main>
    </div>
  );
};

export default Home;
