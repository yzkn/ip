// Copyright (c) 2022 YA-androidapp(https://github.com/YA-androidapp) All rights reserved.


const ip2int = (ip) => {
    const dividedIp = ip.split('.').reverse();
    const byte = 8;

    return dividedIp.reduce((accumulator, v, idx) => {
        const binary = (parseInt(v, 10) << (byte * idx)) >>> 0;
        return accumulator + binary;
    }, 0);
}


const cidr2range = () => {
    let cidrs = document.getElementById('cidr2range_cidr').value;
    if (cidrs) {
        document.getElementById('cidr2range_range').textContent = '';

        ranges = [];

        cidrs = cidrs.split('\n').map(c => c.trim()).filter(c => c.length > 0).sort(function (a, b) {
            return (convertToBinaryNum((a.split('/'))[0].split('.'))) >= (convertToBinaryNum((b.split('/'))[0].split('.'))) ? 1 : -1;
        }).forEach(c => {
            // document.getElementById('cidr2range_range').textContent += convertToIp(getIpRange(c)['min']) + ' - ' + convertToIp(getIpRange(c)['max']) + '\n';
            ranges.push({ 'min': convertToIp(getIpRange(c)['min']), 'max': convertToIp(getIpRange(c)['max']) })
        });

        for (let index = ranges.length - 2; index >= 0; index--) {
            const end = ranges[index]['max'];
            const start = ranges[index + 1]['min'];
            if (ip2int(end) + 1 == ip2int(start)) {
                ranges[index]['max'] = ranges[index + 1]['max'];
                ranges[index + 1] = null;
            }
        }

        ranges.filter(c => c != null).forEach(c => {
            document.getElementById('cidr2range_range').textContent += c['min'] + ' - ' + c['max'] + '\n';
        });
    }
}

const range2cidr = () => {
    const rangeValue = document.getElementById('range2cidr_range').value;
    const startIp = (rangeValue.split('-')[0]).trim();
    const endIp = (rangeValue.split('-')[1]).trim();

    if (validateIp(startIp) && validateIp(endIp)) {
        document.getElementById('range2cidr_cidr').textContent =
            iprange2cidr(
                IPv4.StringToInt(startIp), IPv4.StringToInt(endIp)
            ).join('\n');
    }
}

const validateIp = (ipaddr) => {
    return (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddr))
}


window.addEventListener('DOMContentLoaded', (event) => {
    fetch('https://ipinfo.io?callback&token=1a77db403fe101')
        .then(res => res.json())
        .then(json => document.getElementById('myip').value = json.ip);

    // フォーカス時に全選択
    document.getElementById('cidr2range_range').addEventListener('focus', function () {
        this.select();
    });

    document.getElementById('myip').addEventListener('focus', function () {
        this.select();
    });

    document.getElementById('range2cidr_cidr').addEventListener('focus', function () {
        this.select();
    });

    // 変換
    document.getElementById('cidr2range_cidr').addEventListener('keyup', function () {
        cidr2range();
    });

    document.getElementById('range2cidr_range').addEventListener('keyup', function () {
        range2cidr();
    });

});
