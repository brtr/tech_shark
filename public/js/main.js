import { TargetTokenAddress, ContractAddress, ContractABI } from "./data.js";

(function() {
  let loginAddress;
  const serverUrl = "";
  const appId = "";
  const TargetChain = {
    id: "4",
    name: "rinkeby"
  };
  const web3 = new Web3(Web3.givenProvider);
  const loginButton = document.getElementById('btn-login');
  const logoutButton = document.getElementById('btn-logout');
  const address = document.getElementById('address');
  const claimButton = document.getElementById('btn-claim');

  Moralis.start({ serverUrl, appId });

  const toggleLoader = function() {
    const x = document.getElementById('loader');
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }

  const toggleLoginBtns = function() {
    if (loginAddress == null) {
      loginButton.style.display = "block"
      logoutButton.style.display = "none"
      address.style.display = "none"
    } else {
      loginButton.style.display = "none"
      logoutButton.style.display = "block"

      address.textContent = loginAddress;
      address.style.display = "block"
    }
  }

  const checkLogin = async function() {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts.length > 0) {
      loginAddress = accounts[0];
    } else {
      loginAddress = null;
    }
    toggleLoginBtns();
    toggleLoader();
  }

  const mint = function() {
    var SharkContract = new web3.eth.Contract(ContractABI, ContractAddress);
    SharkContract.methods.mint().send({from: loginAddress})
     .then(function(receipt) {
       console.log("receipt: ", receipt);
       toggleLoader();
       alert("Claim success");
     })
  }

  if (window.ethereum) {
    loginButton.addEventListener('click', async function() {
      toggleLoader();
      checkLogin();
    })

    logoutButton.addEventListener('click', function() {
      loginAddress = null;
      toggleLoginBtns();
    })

    claimButton.addEventListener('click', function() {
      Moralis.Web3API.account.getNFTsForContract({chain: TargetChain.name, address: loginAddress, token_address: TargetTokenAddress})
        .then(function(nfts) {
          console.log(nfts);
          if (nfts["result"].length > 0) {
            toggleLoader();
            mint();
          } else {
            alert("You can't claim TechShark");
          }
        })
    })

    checkLogin();

    // detect Metamask account change
    ethereum.on('accountsChanged', function (accounts) {
      console.log('accountsChanges',accounts);
      loginAddress = accounts[0];
      toggleLoginBtns();
    });

     // detect Network account change
    ethereum.on('chainChanged', function(networkId){
      console.log('networkChanged',networkId);
      if (networkId != parseInt(TargetChain.id)) {
        alert("We don't support this chain, please switch to " + TargetChain.name);
      }
    });
  } else {
    console.warn("No web3 detected.");
  }
})();
