import Web3 from 'web3';

let web3;

if (window && window?.web3) {
  web3 = new Web3(window.web3.currentProvider);
} else {
  // alert("Please Install Metamask To Procees");
}

export default web3;
