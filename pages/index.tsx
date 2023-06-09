import { ConnectWallet, MediaRenderer, useContract, useValidEnglishAuctions, useNFT } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { NFT } from "@thirdweb-dev/sdk";
import MinBid from "../components/MinBid";
import styles from "../styles/Home.module.css";
import React, { useState, useEffect} from "react";
import Link from 'next/link';

const NFT_TOKEN_CONTRACT = "0xaa4bc994775a0d19Ff1c01310191Df6521af12dD";

const Home: NextPage = () => {
  const { contract, isLoading: loadingContract } = useContract(
    '0xBaEB0b96e104E7B067D0Ce32AF1c1E177403d20B',
    "marketplace-v3"
  );

  

  const { data: auctionListing, isLoading: loadingAuction } =
    useValidEnglishAuctions(contract, {
      tokenContract: '0xaa4bc994775a0d19Ff1c01310191Df6521af12dD',
    });

  

  

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
        <h1 className={styles.title}>PERIMETER TOWN - A SOVRN AUCTION</h1>
        <h3 className={styles.title}>Please make sure you are on the ethereum network before bidding</h3>
        <h2>
          <ConnectWallet />
        </h2>
        <Link className={styles.aREF} href="/bids">
         Bidding Log
        </Link> 
        <p></p>
        <a className={styles.aREF} href={`https://www.sovrn.art/auction`}> Artist Statement</a>
        <p></p>

        {!loadingAuction  ? (
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
                        height="1000px"
                        width="1000px"
                      />
                    </div>
                    <div className={styles.textContainer}>
                      <p>{nft.asset.name} #{nft.asset.id}</p>
                      <a className={styles.aREF} href={`https://opensea.io/assets/ethereum/0xaa4bc994775a0d19ff1c01310191df6521af12dd/${nft.asset.id}`}> View on OpenSea</a>
                      <p></p>
                      <p>Listing Id#  {listingId} </p>
                      <p></p>
                      <p>Starting Bid {nft.minimumBidCurrencyValue.displayValue} ETH</p>
                      <p></p>
                      <p>Bidding Buffer {nft.bidBufferBps/100} %</p>
                      <p></p>
                      <p>End Time: {(new Date(nft.endTimeInSeconds*1000)).toUTCString()}</p>
                      
                      <MinBid
                        contractAddress="0xBaEB0b96e104E7B067D0Ce32AF1c1E177403d20B"
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
