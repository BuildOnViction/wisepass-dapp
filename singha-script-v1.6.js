window.ethereum.enable();

function parseQuery(queryString) {
  var query = {};
  var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
  for (var i = 0; i < pairs.length; i++) {
      var pair = pairs[i].split('=');
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
  }
  return query;
}

var APP_PARAMS = parseQuery(location.search)

var tomoAmount = Math.round(1 / parseFloat(APP_PARAMS.rate) * 1000 * 1.05) / 1000
document.getElementById('rate').innerHTML = '$1 = ' + tomoAmount + ' <small>TOMO</small>';

var isBuying = false;
var venueId = '375-199-527'

function buySuccess() {
  document.getElementById('buySession').style.display = 'none';
  document.getElementById('buySuccessSesstion').style.top = '0';
  var videoInterval = setInterval(() => {
    try {
      // document.getElementsByTagName('video')[0].currentTime = 0
      // document.getElementsByTagName('video')[0].play()
      document.getElementById('imgSuccess').src = './img/singha.gif';
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
    console.log(accounts[0])
    web3.eth.sendTransaction({
      from: accounts[0],
      to: '0x68C68b7aA02C08B6f489Fba22219eB57Ece362fA',
      gasLimit: 100000,
      gasPrice: 300000000,
      value: BigNumber(tomoAmount).multipliedBy(1e18).toString(10)
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

            var xhr = new XMLHttpRequest();
            var url = "http://apimobile.wisepass.co/v4/tomo/txhash/check";
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("api_key", APP_PARAMS.appID);
            xhr.onreadystatechange = function () {
              if (xhr.response) {
                isBuying = false;
                document.getElementById('buyButton').innerHTML = 'BUY A BEER';
                buySuccess();
                var data = JSON.parse(xhr.response);
                if (data) {
                }
              }
            };
            var data = JSON.stringify({
              'venueId': APP_PARAMS.venueId,
              'txhash': hash
            });
            xhr.send(data);
          }
        });
      }, 3000);
    });
  });

}
