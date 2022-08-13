import React, { useState } from "react";
import styles from "../../styles/Home.module.css";
import Image from "next/image";
import creator_nft from "../../src/assets/creator-nft.png";
import content1 from "../../src/assets/gold.png";
import content2 from "../../src/assets/silver.png";
import profile from "../../src/assets/profile.png";
import { constants } from "ethers";
import {
  useContract,
  useSigner,
  useProvider,
  useAccount,
  useConnect,
} from "wagmi";
import {
  Creator_Contract_address,
  Creator_Contract_ABI,
  Content_ABI,
  Content_Contract_address,
  Subscription_Contract_ABI,
  Subscription_Contract_Address,
} from "../../utils/constants";
import { GetData } from "../../src/components/GetData";

export default function creator() {
  const [isCreator, setIsCreator] = useState(false);
  const [creator, setCreator] = useState({});
  const [id, setId] = useState(0);
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const provider = useProvider();

  const Creator_contract = useContract({
    addressOrName: Creator_Contract_address,
    contractInterface: Creator_Contract_ABI,
    signerOrProvider: signer || provider,
  });

  const Content_contract = useContract({
    addressOrName: Content_Contract_address,
    contractInterface: Content_ABI,
    signerOrProvider: signer || provider,
  });

  const Subscription_contract = useContract({
    addressOrName: Subscription_Contract_Address,
    contractInterface: Subscription_Contract_ABI,
    signerOrProvider: signer || provider,
  });

  /// Check for creator if the user is one or Not , and accordingly render the Data
  const checkCreator = async () => {
    try {
      console.log("Checking if Creator or Not");
      const check = await Creator_contract.checkStatus(address);
      console.log(check);
      // fetch the value from the fetch
      setIsCreator(check);
    } catch (error) {
      console.log(error);
    }
  };

  /// fetch the creator data and ipfs CID from the Creator Contract
  const fetchCreator = async () => {
    try {
      console.log("Fetching Creator Id");
      const id = await Creator_contract.getId(address);

      // separate the id value from value
      console.log(id);

      console.log("Fetching Creators details");
      const data = await Creator_contract.fetchCreators(id);
      console.log(data);
      // set the Data(ipfs URI) part to creator Details
      // set the Balance of the user to the balance
      setCreator(data);
    } catch (error) {
      console.log(error);
    }
  };

  /// fetch the data from the CID from IFPS for both type of datas
  const fetchIPFS = async (_cid) => {
    console.log("fetching the files");
    // const _cid = "bafkreifxtpdf5lcmkqjqmpe4wjgfl4rbov23ryn5merejridxk27pfzufq";
    const data = await GetData(_cid);
    console.log(data);

    /// get the json and use that json for further processing of the data
    /// {name , description(bio) , image (pfp), }
  };

  /// Fetching the Ipfs CID array from the content contract for the creator
  const fetchContent = async (_id) => {
    try {
      console.log("Fetching content for the creator");
      const response = await Content_contract.getContent(_id);
      /// we get the array of IPFS strings , need to render the data from that link on the page
      console.log("Data fetched");
    } catch (error) {
      console.log(error);
    }
  };

  const Withdraw = async (_id) => {
    try {
      /// accepts the ID of the Creator to be able to
      console.log("Withdrawing balance from the contract...");
      const tx = await Subscription_contract.withdraw(_id);
      await tx.wait();
      console.log("Amount Withdrawn to the creator account");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={`${styles.explore}`}>
        <h1 className={styles.section_heading}>Creator Account Details</h1>
        <div className={`${styles.creator_section}`}>
          <div className={styles.account_details}>
            <div className={styles.profile_image}>
              <Image src={profile} />
            </div>
            <div className={styles.wallet_details}>
              <h2>Wallet Details</h2>
              <h3>Address: </h3>
              <p className={styles.address}>
                0xA25c5bE1324764573dE0a14ABFe0279B4291adfA
              </p>
              <h3>Balance: </h3>
              <p>10 MATIC</p>
              <div>
                <button className={styles.explore_btn}>Withdraw</button>
              </div>
            </div>
            <div className={styles.user_subscription}>
              {/* <h2 className={styles.card_title}>Creator NFT</h2> */}
              <div className={styles.creator_nft}>
                <Image src={creator_nft} />
              </div>
            </div>
          </div>
          {/* <hr /> */}

          <h2 className={styles.card_title}>Content</h2>
          <div className={styles.creator_content}>
            <div className={styles.content}>
              <Image src={content1} />
            </div>
            <div className={styles.content}>
              <Image src={content2} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
