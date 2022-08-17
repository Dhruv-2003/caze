import React, { useState, useEffect } from "react";
import styles from "./Post.module.css";
import { Content_ABI, Content_Contract_address } from "../../utils/constants";
import { useContract, useSigner, useProvider, useAccount } from "wagmi";
import { StoreContent } from "./StoreContent";
import { StorePost } from "./StorePost";

export default function CreatePost(props) {
  const [description, setdescription] = useState("");
  const [media, setMedia] = useState([]);
  const [contentIpfs, setContentIpfs] = useState("");
  const [postIpfs, setPostIpfs] = useState("");
  const [Id, setId] = useState(0);
  const { data: signer } = useSigner();
  const provider = useProvider();

  const Content_contract = useContract({
    addressOrName: Content_Contract_address,
    contractInterface: Content_ABI,
    signerOrProvider: signer || provider,
  });

  // media content is stored first
  const StoreMedia = async () => {
    try {
      console.log("Uploading Media to IPFS ... ");
      const CID = await StoreContent(media);
      const hash = `https://ipfs.io/ipfs/${CID}`;
      setContentIpfs(hash);
      console.log("Content uploaded to IPFS successfully 🚀🚀 ");
      uploadPost(hash);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };

  // post is then uploaded to the IPFS
  const uploadPost = async (_contentURL) => {
    try {
      console.log("Storing the post data on IPfS ..");
      const cid = await StorePost(description, _contentURL);
      const hash = `https://ipfs.io/ipfs/${cid}/post.json`;
      console.log("Post uploaded to IPFS");
      setPostIpfs(hash);
      addContent(Id, hash);
    } catch (error) {
      console.log(error);
    }
  };

  /// function to add the content / post to the contract
  const addContent = async (_id, _hash) => {
    try {
      console.log("Adding the Content for the Creator... ");
      const tx = await Content_contract.addContent(_id, _hash);
      await tx.wait();
      console.log(tx.hash);
      console.log(tx);
      console.log("Content Added Successfully🚀🚀");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setId(props.Id);
    console.log(props.Id);
  }, [props.Id]);

  return (
    <>
      <div className={styles.post}>
        <div className={styles.create_post}>
          <h2>Create New Post</h2>
          {/* <textarea
        className={styles.post_content}
        placeholder="create a new post"
        type="text"
      /> */}

          <textarea
            className={styles.post_input}
            placeholder="Create a new post"
            cols={150}
            onChange={(e) => setdescription(e.target.value)}
          />
          <h4>Select Media File</h4>
          <input
            className={styles.post_media}
            type="file"
            onChange={(e) => setMedia(e.target.files)}
            // onChange={(e) => setPfp(e.target.files[0])}
          />
          <button
            onClick={StoreMedia}
            className={styles.create_post_btn}
            type="button"
          >
            Post
          </button>
        </div>
      </div>
    </>
  );
}
