var publictransaction = '';
$("#partCheckEmail").css("display", "block");
$("#partTopUp").css("display", "none");
$("#partSucceed").css("display", "none");

$( document ).ready(function() {
    $("#email").val(localStorage.getItem("userEmail"));
    window.ethereum.enable();
});

function validateEmail(email) {
    $('#btnSubmit').text('LOADING...');
    $('#btnSubmit').disabled = true;
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


    var xhr = new XMLHttpRequest();
    var url = "https://apiwisepass.tomochain.com/tomo/service/validateemail";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.response)
        {
            var item = JSON.parse(xhr.response);
            if (item)
            {
                var $result = $("#result");
                if (item.statusCode === 200) {
                    $result.text(item.message);
                    localStorage.setItem("userEmail", email);
                    $("#transaction").val(item.data.transaction);
                    $("#wallet").val(item.data.wallet);
                    $("#topupValue").text(item.data.wallets[0].value);
                    web3.eth.getBalance(web3.eth.defaultAccount, function(error, b) {
                        b = BigNumber(b).dividedBy(1e+18).toString(10);
                        $("#yourBalance").text(b);
                    });

                    $result.css("color", "green");
                    $("#partCheckEmail").css("display", "none");
                    $("#partTopUp").css("display", "block");
                } else {
                    $result.text(item.message);
                    $result.css("color", "red");
                }
            }
        }
        $('#btnSubmit').text('SUBMIT');
        $('#btnSubmit').disabled = false;
    }
    
    var data = JSON.stringify({'email': email});
    xhr.send(data);
}

function validate() {
    var $result = $("#result");

    var email = $("#email").val();
    $result.text("");

    validateEmail(email);
}
//button check email
$("#btnSubmit").on("click", validate);

//button top up
$("#btnTopUp").on("click", topUp);

function topUp() {

    $('#btnTopUp').text('LOADING...');
    $('#btnTopUp').disabled = true;

    var email = $("#email").val();
    var transaction = $("#transaction").val();
    var topupValue = $("#topupValue").text();
    var wpWallet= $("#wpWallet").val();
    topupValue = BigNumber(topupValue).multipliedBy(1e18).toString(10);

    web3.eth.sendTransaction({
        from: web3.eth.defaultAccount,
        to: wpWallet,
        gasLimit: 21000,
        gasPrice: 300000000,
        value: topupValue
    }, function (error, hash) {
        if (error) {
            $('#btnTopUp').text('SUBMIT');
            $('#btnTopUp').disabled = false;
            $result.text(error);
            $result.css("color", "red");
            return;
        }
        var intv = setInterval(function(){
            web3.eth.getTransactionReceipt(hash, function(error, ret) {
                if (ret && ! error) {
                    clearInterval(intv);
                    var xhr = new XMLHttpRequest();
                    var url = "https://apiwisepass.tomochain.com/tomo/service/topup";
                    xhr.open("POST", url, true);
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.onreadystatechange = function () {
                        if (xhr.response)
                        {
                            var item = JSON.parse(xhr.response);
                            if (item)
                            {
                                var $result = $("#resultTopUp");
                                if (item.statusCode === 200) {
                                    $result.text(item.message);
                                    $result.css("color", "green");

                                    $("#partCheckEmail").css("display", "none");
                                    $("#partTopUp").css("display", "none");
                                    $("#partSucceed").css("display", "block");
                                } else {
                                    $result.text(item.message);
                                    $result.css("color", "red");
                                }
                            }
                        }

                        $('#btnTopUp').text('SUBMIT');
                        $('#btnTopUp').disabled = false;
                    };
                    
                    var data = JSON.stringify({'transaction' : transaction, 'hash' : hash});
                    xhr.send(data);
                }
            });
        }, 3000);

    });
    
}
