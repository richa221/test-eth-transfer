import React, { useEffect, useState, useRef } from "react";
import Web3 from 'web3';

import "./index.css";


function WalletSection() {

    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [balance, setBalance] = useState('');
    const [toAddress, setToAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [status, setStatus] = useState('');

     // Connect to MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3Instance.eth.getAccounts();
        const balanceInWei = await web3Instance.eth.getBalance(accounts[0]);
        const balanceInEth = web3Instance.utils.fromWei(balanceInWei, 'ether');

        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setBalance(balanceInEth);
      } catch (error) {
        setStatus('User denied wallet connection');
      }
    } else {
      setStatus('Please install MetaMask to use this wallet.');
    }
  };

  // Send ETH
  const sendTransaction = async () => {
    if (!web3 || !account) {
      setStatus('Connect your wallet first.');
      return;
    }

    try {
      setStatus('Sending transaction...');
      await web3.eth.sendTransaction({
        from: account,
        to: toAddress,
        value: web3.utils.toWei(amount, 'ether'),
      });
      setStatus('Transaction successful!');
    } catch (error) {
      setStatus(`Transaction failed: ${error.message}`);
    }
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
                                <form>
                                    <div className="row">
                                        
                                    <div className="col-md-6">
                                            <input
                                                type="text"
                                                placeholder="Recipient Address"
                                                value={toAddress}
                                                onChange={(e) => setToAddress(e.target.value)}
                                                className="mail_text"
                                            />
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <input
                                                type="number"
                                                placeholder="Amount in ETH"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="mail_text"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="btn_main">
                                        <div className="send_bt active">
                                            <a onClick={sendTransaction}>Send ETH</a>
                                        </div>
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