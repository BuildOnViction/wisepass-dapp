var publictransaction = '';
$("#partCheckEmail").css("display", "block");
$("#partTopUp").css("display", "none");
$("#partSucceed").css("display", "none");


	function validateEmail(email) {
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
		};
		
		var data = JSON.stringify({'email': email});
		xhr.send(data);
	}

	function validate() {
		var $result = $("#result");

		var email = $("#email").val();
		$result.text("");

		validateEmail(email);

		// if (validateEmail(email)) {
		// 	$result.text("You have successfully registered");
		// 	$result.css("color", "green");
		// 	$("#partCheckEmail").css("display", "none");
		// 	$("#partTopUp").css("display", "block");
		// } else {
		// 	$result.text(email + " wrong email format :(");
		// 	$result.css("color", "red");
		// }
		//return false;
	}
	//button check email
	$("#btnSubmit").on("click", validate);

	//button top up
	$("#btnTopUp").on("click", topUp);

	function topUp() {

		var email = $("#email").val();
		var transaction = $("#transaction").val();
		var topupValue = $("#topupValue").text();
		var wpWallet= $("#wpWallet").val();
        topupValue = BigNumber(topupValue).multipliedBy(1e18).toString(10);

        web3.eth.sendTransaction({
            from: web3.eth.defaultAccount,
            to: wpWallet,
            value: topupValue
        }, function (error, hash) {
            if (error) {
                $result.text(error);
                $result.css("color", "red");
            }

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
            };
            
            var data = JSON.stringify({'transaction' : transaction, 'hash' : hash});
            xhr.send(data);
        });
		
	}
	
	function signUpEmail(email, transaction, hash) {
		var xhr = new XMLHttpRequest();
		var url = "http://apiservice.wisepass.co/tomo/service/topup";
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var json = JSON.parse(xhr.responseText);
				$("#partCheckEmail").css("display", "none");
				$("#partTopUp").css("display", "block");
			}
		};
		
		var data = JSON.stringify({email, transaction, hash});
		xhr.send(data);
	}
	
	
