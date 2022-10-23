import React from "react";
import logo from "./logo.svg";
import "./App.css";
import ThirdStorage from "@thirdstorage/sdk";
import { useAccount, useConnect, useNetwork, useSignMessage } from "wagmi";
import { useEffect, useState } from "react";

function App() {
  const thirdStorageClient = new ThirdStorage(
    //Replace the ThirdStorage Server URL
    "http://localhost:3000/api/projects/mbtcvlutlw"
  );
  const [data, setData] = useState("");
  const [file, setFile] = useState(null);
  const [key, setKey] = useState("");

  const set = async (is_private = true) => {
    console.log(
      is_private
        ? (await thirdStorageClient.signMessageForEncryption()) &&
            (await thirdStorageClient.private.set(key, data))
        : await thirdStorageClient.public.set(key, data)
    );

    // const message = `Stored encrypted data to thirdStorageClient in ${setDuration} ms \n ${JSON.stringify(
    //   encryptedData
    // )}`;
    //
    // alert(message);

    alert("Stored!");

    await retrieve(is_private);
  };

  async function retrieve(is_private = true) {
    const res = is_private
      ? await thirdStorageClient.private.get(key)
      : await thirdStorageClient.public.get(key);
    console.log(res);

    let getMessage;

    if (res.data) {
      getMessage = `Retrieved data is \n ${JSON.stringify(res.data)}`;
    } else {
      getMessage = "Data not found";
    }

    alert(getMessage);
  }

  const [isInitializing, setIsInitializing] = useState(true);
  const [fetchedAddress, setFetchedAddress] = useState(false);

  const {
    connectAsync,
    connectors,
    isLoading,
    pendingConnector,
  } = useConnect();

  const { address, isConnected } = useAccount();

  const { signMessageAsync } = useSignMessage();
  const { chain: activeChain } = useNetwork();

  useEffect(() => {
    (async () => {
      if (!isLoading && isInitializing && !isConnected) {
        setIsInitializing(false);
      } else if (!isLoading && isConnected && isInitializing) {
        let a = await thirdStorageClient.signedInWallet();

        if (a) {
          setFetchedAddress(a);
        }
      }
    })();
  }, []);

  const signIn = async (a = null, chainId = null) => {
    try {
      let res = {};
      if (!isConnected) {
        res = await connectAsync({
          connector: connectors[0],
        });

        a = res.account;
        chainId = res.chain?.id;
      } else {
        a = address;
        chainId = activeChain?.id;
        console.log(address, chainId);
        if (!address || !chainId) return;
      }

      setIsInitializing(true);
      if (await thirdStorageClient.signIn(a, chainId, signMessageAsync)) {
        alert("Logged in!");
        window.location.href = window.location.href;
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = async () => {
    await thirdStorageClient.signOut();
    alert("Logged Out!");
    window.location.href = window.location.href;
  };

  // if (isInitializing) {
  //   return <div>"Waiting for wallet to get connected..." </div>;
  // }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="flex space-x-2">
          <button
            onClick={() => signIn()}
            disabled={!connectors[0].ready || fetchedAddress}
            className="p-3 border rounded-xl border-gray-400 text-[#ffffff9d] title"
          >
            {fetchedAddress
              ? `Connected to ${fetchedAddress.substring(
                  0,
                  3
                )}...${fetchedAddress.substring(
                  fetchedAddress.length - 3,
                  fetchedAddress.length
                )} `
              : "Connect Wallet"}
          </button>
          {fetchedAddress && (
            <div>
              <div className="p-3 border rounded-xl border-gray-400 text-[#ffffff9d] title">
                Logged in as {fetchedAddress}
              </div>
              <br />
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
        {fetchedAddress ? (
          <div>
            <div>
              <br />
              Enter Key:
              <input onChange={(e) => setKey(e.target.value)} />
              Enter Data:
              <input onChange={(e) => setData(e.target.value)} />
              Choose file:
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <button onClick={() => set(false)}>
                Click this button to store as public data
              </button>
              <button onClick={() => set(true)}>
                Click this button to store as private data
              </button>
              <button onClick={() => retrieve(false)}>
                Click this button to retrieve data from public
              </button>
              <button onClick={() => retrieve(true)}>
                Click this button to retrieve data from private
              </button>
              <button
                onClick={() =>
                  thirdStorageClient.database
                    .set(key, data)
                    .then((res) => alert(res))
                }
              >
                Click this button to store data into database
              </button>
              <button
                onClick={() =>
                  thirdStorageClient.database.get(key).then((res) => alert(res))
                }
              >
                Click this button to retrieve data from database
              </button>
              <button
                onClick={() => {
                  if (file === null) {
                    alert("Please choose a file");
                    return;
                  }

                  thirdStorageClient.ipfs
                    .set(key, file)
                    .then((res) => alert(res));
                }}
              >
                Click this button to store file in IPFS
              </button>
              <button
                onClick={() =>
                  thirdStorageClient.ipfs.get(key).then((res) => alert(res))
                }
              >
                Click this button to retrieve CID for a given key
              </button>
              <button
                onClick={() => {
                  if (file === null) {
                    alert("Please choose a file");
                    return;
                  }

                  thirdStorageClient.ipns
                    .set(key, file)
                    .then((res) => alert(res));
                }}
              >
                Click this button to store file in IPNS
              </button>
              <button
                onClick={() =>
                  thirdStorageClient.ipns.get(key).then((res) => alert(res))
                }
              >
                Click this button to retrieve Name for a given key
              </button>
            </div>
          </div>
        ) : (
          <div>Please sign in to continue!</div>
        )}
      </header>
    </div>
  );
}

export default App;
