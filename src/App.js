import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};
// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [transactions, setTransactions] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState("");
  const [blockInput, setBlockInput] = useState("");
  const [blockResult, setBlockResult] = useState("");
  const [blockError, setBlockError] = useState("");

  const handleBlockInputChange = (event) => {
    setBlockInput(event.target.value);
  };

  const handleBlockClickButton = async() => {
    try {
      const result = await getBlockResult(blockInput);
      setBlockResult(JSON.stringify(result));
      setBlockError("");
    } catch {
      setBlockResult("");
      setBlockError("Error: not exist!");
    }
  };

  const handleTransactionClickButton = async(transactionNumber) => {
    const result = await alchemy.core.getTransaction(`${transactionNumber}`);
    setCurrentTransaction(JSON.stringify(result));
  }

  async function getBlockResult(blockNumber) {
    const response = await alchemy.core.getBlock(Number(blockNumber));
    setTransactions(response.transactions);
    return response;
  }

  function generateTransactionsButton(){
    return transactions.map((transaction, index) => (
      <div key={index}>
          <button onClick={() => handleTransactionClickButton(transaction)}> Get {transaction} information </button>
          <br />
      </div>
    ));
  }

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
    
  });

  return (
    <div>
      <div className="App">Block Number: {blockNumber}</div>

      <div>
        <input type="text" value={blockInput} onChange={handleBlockInputChange} />
        <button onClick={handleBlockClickButton}>Get Block Info</button>
        <br/>
        { blockResult ? (
          <div>
            <div className="row">
              <div className="col-md-3">
                <p>
                  <strong>
                    Block info:
                  </strong>
                </p>
                <br/>
                <pre style={{whiteSpace: "pre-wrap"}}>
                  {blockResult}
                </pre>
              </div>

              <div className="col-md-3">
                <p>
                  <strong>
                    Transactions in block number: {blockInput}
                  </strong>
                </p>
                <div>
                  {generateTransactionsButton()}
                </div>
              </div>

              { currentTransaction ? (<div className="col-md-3">
                <p>
                  <strong>
                    Transaction info:
                  </strong>
                </p>
                <br/>
                <pre style={{whiteSpace: "pre-wrap"}}>
                  {currentTransaction}
                </pre>
              </div>) : (<div></div>) }
            </div>
          </div>
        ) : (<div>{blockError}</div>) }
      </div>
    </div>
      
  );
}

export default App;
