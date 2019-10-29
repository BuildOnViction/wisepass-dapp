var publictransaction = '';
window.ethereum.enable();
var isBuying = false;
var recipientAddress = '0x68C68b7aA02C08B6f489Fba22219eB57Ece362fA';
var venueId = '375-199-527'
console.log(web3.currentProvider)



function buySuccess() {
  document.getElementById('buySession').style.display = 'none';
  document.getElementById('buySuccessSesstion').style.top = '0';
  var videoInterval = setInterval(() => {
    try {
      document.getElementsByTagName('video')[0].currentTime = 0
      document.getElementsByTagName('video')[0].play()
      clearInterval(videoInterval);
    }
    catch (ex) {

    }
  }, 10);
}

function buyABeer() {
  if (isBuying) return;
  isBuying = true;
  document.getElementById('buyButton').innerHTML = 'buying...';

  var web3 = new Web3(window.web3.currentProvider);

  window.web3.eth.getAccounts(function (err, accounts) {
    web3.eth.sendTransaction({
      from: accounts[0],
      to: recipientAddress,
      gasLimit: 100000,
      gasPrice: 300000000,
      value: BigNumber('0.001').multipliedBy(1e18).toString(10)
    }, function (error, hash) {
      if (error) {
        var errMsg = (error.message || error.toString() || '').toLowerCase();
        isBuying = false;
        document.getElementById('buyButton').innerHTML = 'BUY A BEER';
        if (errMsg.indexOf('user denied transaction signature') >= 0 || errMsg.indexOf('cancelled') >= 0) {
          return;
        }
        else {
          alert('Buy error, please try again.');
        }

        return;
      }
      document.getElementById('buyButton').innerHTML = 'confirming...';

      var intv = setInterval(function () {
        web3.eth.getTransactionReceipt(hash, function (error, ret) {
          if (ret && !error) {
            clearInterval(intv);

            isBuying = false;
            document.getElementById('buyButton').innerHTML = 'BUY A BEER';
            buySuccess();

            // var xhr = new XMLHttpRequest();
            // var url = "http://apimobile.wisepass.co/v4/tomo/txhash/check";
            // xhr.open("POST", url, true);
            // xhr.setRequestHeader("Content-Type", "application/json");
            // xhr.setRequestHeader("api_key", "****");
            // xhr.onreadystatechange = function () {
            //   if (xhr.response) {
            //     isBuying = false;
            //     document.getElementById('buyButton').innerHTML = 'BUY A BEER';
            //     buySuccess();
            //     var data = JSON.parse(xhr.response);
            //     if (data) {
            //     }
            //   }
            // };
            // var data = JSON.stringify({
            //   'venueId': venueId,
            //   'txhash': hash
            // });
            // xhr.send(data);
          }
        });
      }, 3000);
    });
  });

}
