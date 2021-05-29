function add_coupon() {
    alert("hi");
    const url = new URL(location.href);
    var sendData = {
        "userJwt": urlParams.get('user'),
        "storeCode" :document.getElementById("code").value,
    }

    $.ajax({
      url: "../notices",
      type: "POST",
      cache: false,
      data: JSON.stringify(sendData),
      dataType: "json",
    }).done(function (data) {
      console.log(data);
    });
  }