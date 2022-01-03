import { TechSharkAddress, WoolAddress, TechSharkABI, WoolABI } from "./data.js";

(function() {
  let loginAddress;
  const TargetChain = {
    id: "",
    name: ""
  };

  const provider = new ethers.providers.Web3Provider(web3.currentProvider);
  const signer = provider.getSigner();
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
    const WoolContract = new ethers.Contract(WoolAddress, WoolABI, provider);
    const amount = ethers.utils.parseEther("10000");
    const allowance = await WoolContract.allowance(loginAddress, TechSharkAddress);
    console.log("allowance Balance: ", allowance);
    if (allowance >= amount) {
      mint();
    } else {
      const woolWithSigner = WoolContract.connect(signer);
      woolWithSigner.approve(TechSharkAddress, amount)
      .then(function(receipt) {
        console.log("approve wool receipt: ", receipt);
        mint();
      })
    }
  }

  const mint = function() {
    const SharkContract = new ethers.Contract(TechSharkAddress, TechSharkABI, provider);
    const sharkWithSigner = SharkContract.connect(signer);
    sharkWithSigner.mint(1, {value: ethers.utils.parseUnits('0.0001', 'ether')})
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
