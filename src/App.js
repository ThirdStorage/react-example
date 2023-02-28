import React, { useEffect, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  ThirdStorageClient,
  ArcanaAuthButton,
  MetamaskAuthButton,
  DisconnectButton,
} from "@thirdstorage/sdk";
import { useState } from "react";

function App() {
  // Initializing the client
  const [isInitialized, setIsInitialized] = useState(false);
  const thirdStorageClientRef = useRef(
    new ThirdStorageClient(
      //Replace the ThirdStorage Server URL
      "http://localhost:3000/api/project"
    )
  );

  const thirdStorageClient = thirdStorageClientRef.current;

  const [data, setData] = useState("");
  const [file, setFile] = useState(null);
  const [key, setKey] = useState("");

  // Setting data
  const set = async (is_private = true) => {
    console.log(
      is_private
        ? (await thirdStorageClient.signMessageForEncryption()) &&
            (await thirdStorageClient.private.set(key, data))
        : await thirdStorageClient.public.set(key, data)
    );
    alert("Stored!");
    await get(is_private);
  };

  // Getting data
  async function get(is_private = true) {
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

  // Logging out
  const handleLogout = async () => {
    await thirdStorageClient.signOut();
    alert("Logged Out!");
    window.location.href = window.location.href;
  };

  useEffect(() => {
    (async () => {
      await thirdStorageClient.initialize();
      setIsInitialized(true);
    })();
  }, []);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="flex space-x-2">
          <ArcanaAuthButton thirdStorageClient={thirdStorageClient} />
          <MetamaskAuthButton thirdStorageClient={thirdStorageClient} />
          <DisconnectButton thirdStorageClient={thirdStorageClient} />
          {thirdStorageClient.isConnected && (
            <div>
              <div className="p-3 border rounded-xl border-gray-400 text-[#ffffff9d] title">
                Welcome, {thirdStorageClient.connectedAddress}
              </div>
              <br />
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
        {thirdStorageClient.isConnected ? (
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
              <button onClick={() => get(false)}>
                Click this button to retrieve data from public
              </button>
              <button onClick={() => get(true)}>
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
