// https://qiita.com/CyberMergina/items/3044f67aa4e2041e0141


/**
 * 10進数表記ののIPアドレスを2進数に変換
 * @params array sample: ['127', '0', '0', '0']
 * @return string sample: 01111111000000000000000000000000
 **/
function convertToBinaryNum(group) {
    var ret = "";
    for (var i = 0; i < 4; i++) {
        var bit = "00000000" + parseInt(group[i], 10).toString(2);
        ret += bit.slice(-8);
    }
    return ret;
}

/**
 * 2進数表記ののIPアドレスを10進数に変換
 * @params array sample: 01111111000000000000000000000000
 * @return string sample: 127.0.0.1
 **/
function convertToIp(num) {
    var ret = "";
    ret = parseInt(num.slice(0, 8), 2) + ".";
    ret += parseInt(num.slice(8, 16), 2) + ".";
    ret += parseInt(num.slice(16, 24), 2) + ".";
    ret += parseInt(num.slice(24, 32), 2);
    return ret;
}

/**
 * IPアドレスの範囲を取得
 **/
function getIpRange(ipAddress) {
    var ip = ipAddress.split('/'),
        group = ip[0].split('.'),
        ipBit = "",
        minIpBit = "",
        maxIpBit = "",
        maxAddress = ip[0];

    // 入力値が空、IPアドレスをカンマ基準で配列にした際に４つじゃない場合
    // ネットワークのビット数が規定の数値(1~32)じゃない場合
    if (ip === "" || group.length !== 4 ||
        (ip.length === 2 && String(ip[1]).match(/^([1-9]|[1-2][0-9]|3[0-2])$/) === null)) {
        return { min: '', max: '' }; // 空を返す
    }

    // 入力されたIPアドレスを2進数表記に変換し保持
    minIpBit = convertToBinaryNum(group);

    // IPアドレスのみの場合
    if (ip.length === 1) {
        return { min: minIpBit, max: minIpBit };
    }
    for (var i = 0; i < 4; i++) {
        var bit = parseInt(group[i], 10).toString(2);
        if (Number(ip[1]) >= ((i + 1) * 8)) {
            ipBit += ("00000000" + bit).slice(-8);
        }
        else {
            var tmpIpBit = ("00000000" + bit).slice(-8);
            ipBit += (tmpIpBit.slice(0, Number(ip[1]) - (i * 8)) + "11111111").slice(0, 8);
            break;
        }
    }
    maxIpBit = (ipBit + "11111111111111111111111111111111").slice(0, 32);

    return { min: minIpBit, max: maxIpBit };
}