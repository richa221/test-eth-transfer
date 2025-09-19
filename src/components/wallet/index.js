import React, { useState } from "react";
import Web3 from "web3";
import "./index.css";

/**
 * WalletSection Component
 * Provides an interface to connect MetaMask, display wallet address and balance,
 * and send ETH to any recipient address.
 *
 * Features:
 * - Connect to MetaMask wallet
 * - Display connected account and ETH balance
 * - Send ETH to a specified address
 */
function WalletSection() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Validates whether a given string is a valid Ethereum address.
   * @param {string} address - The Ethereum address to validate.
   * @returns {boolean} True if valid address, false otherwise.
   */
  const isValidAddress = (address) => {
    return web3 && web3.utils.isAddress(address);
  };

  /**
   * Connects to the user's MetaMask wallet.
   * Sets up web3 instance, gets account and balance.
   * Handles errors if MetaMask is not installed or user denies access.
   * @async
   */
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3Instance.eth.getAccounts();
        const balanceInWei = await web3Instance.eth.getBalance(accounts[0]);
        const balanceInEth = web3Instance.utils.fromWei(balanceInWei, "ether");
        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setBalance(balanceInEth);
        setStatus("");
      } catch (error) {
        setStatus("User denied wallet connection");
      }
    } else {
      setStatus("Please install MetaMask to use this wallet.");
    }
  };

  /**
   * Sends ETH from the connected wallet to the recipient address.
   * Validates the recipient address and amount before sending.
   * Handles transaction status and errors.
   * @param {object} e - The event object from form submission.
   * @async
   */
  const sendTransaction = async (e) => {
    e.preventDefault();
    if (!web3 || !account) {
      setStatus("Connect your wallet first.");
      return;
    }
    if (!isValidAddress(toAddress)) {
      setStatus("Invalid recipient address.");
      return;
    }
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setStatus("Enter a valid amount.");
      return;
    }
    setLoading(true);
    setStatus("Sending transaction...");
    try {
      await web3.eth.sendTransaction({
        from: account,
        to: toAddress,
        value: web3.utils.toWei(amount, "ether"),
      });
      setStatus("Transaction successful!");
      setAmount("");
      setToAddress("");
    } catch (error) {
      setStatus(`Transaction failed: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="contact_section layout_padding">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="contact_taital">Transfer ETH</h1>
          </div>
        </div>
        {!account ? (
          <button onClick={connectWallet}>Connect MetaMask</button>
        ) : (
          <div className="contact_section_2">
            <div className="row">
              <div className="col-md-12">
                <p className="banner_text"><strong>Connected:</strong> {account}</p>
                <p className="banner_text"><strong>Balance:</strong> {balance} ETH</p>
              </div>
              <div className="col-md-8">
                <div className="mail_section map_form_container">
                  <form onSubmit={sendTransaction}>
                    <div className="row">
                      <div className="col-md-6">
                        <input
                          type="text"
                          placeholder="Recipient Address"
                          value={toAddress}
                          onChange={(e) => setToAddress(e.target.value)}
                          className="mail_text"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="number"
                          placeholder="Amount in ETH"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="mail_text"
                          min="0.0001"
                          step="any"
                          required
                        />
                      </div>
                    </div>
                    <div className="btn_main">
                      <button
                        className="send_bt active"
                        type="submit"
                        disabled={
                          loading ||
                          !isValidAddress(toAddress) ||
                          isNaN(amount) ||
                          parseFloat(amount) <= 0
                        }
                      >
                        {loading ? "Sending..." : "Send ETH"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {status && <p className="status">{status}</p>}
      </div>
    </div>
  );
}

export default WalletSection;