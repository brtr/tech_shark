import { TechSharkAddress, WoolAddress, TechSharkABI, WoolABI } from "./data.js";

(function() {
  let loginAddress;
  const TargetChain = {
    id: "",
    name: ""
  };

  const web3 = new Web3(Web3.givenProvider);
  const SharkContract = new web3.eth.Contract(TechSharkABI, TechSharkAddress);
  const loginButton = document.getElementById('btn-login');
  const logoutButton = document.getElementById('btn-logout');
  const address = document.getElementById('address');
  const claimButton = document.getElementById('btn-claim');

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

  const approveWool = async function() {
    var WoolContract = new web3.eth.Contract(WoolABI, WoolAddress);
    var balance = await WoolContract.methods.balanceOf(loginAddress).call();
    balance = web3.utils.fromWei(balance, "ether");
    console.log("Wool Balance: ", balance);
    var WoolFee = web3.utils.toWei("10000", "ether");

    if (balance < 100) {
      alert("You need 100 WOOL to claim each time");
    } else {
      var allowance = await WoolContract.methods.allowance(loginAddress, TechSharkAddress).call();
      if (allowance >= WoolFee) {
        mint();
      } else {
        WoolContract.methods.approve(TechSharkAddress, WoolFee).send({from: loginAddress})
        .then(function(receipt) {
          console.log("approve wool receipt: ", receipt);
          mint();
        })
      }
    }
  }

  const mint = function() {
    SharkContract.methods.mint(1).send({from: loginAddress})
     .then(function(receipt) {
       console.log("mint receipt: ", receipt);
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
      approveWool();
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
