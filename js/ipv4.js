// https://qiita.com/arc279/items/5edb43546f2000ae0ce2


class IPv4 {

    static StringToInt(s) {
        return IPv4.OctetsToInt(IPv4.StringToOctets(s))
    }

    static OctetsToInt(octets) {
        const ret = (octets[0] << 24) + (octets[1] << 16) + (octets[2] << 8) + octets[3];
        return ret >>> 0; // cast to unsigned
    }

    static IntToOctets(i) {
        return [
            (i >>> 24) & 0xFF,
            (i >>> 16) & 0xFF,
            (i >>> 8) & 0xFF,
            (i >>> 0) & 0xFF,
        ];
    }

    static IntToString(i) {
        return this.OctetsToString(this.IntToOctets(i));
    }

    static StringToOctets(s) {
        return s.split(".").map((x) => parseInt(x, 10))
    }

    static OctetsToString(octets) {
        return octets.join(".")
    }

    static IntToBits(i) {
        const mask = [...Array(32).keys()].reverse().map((x) => 1 << x);
        const bits = mask.map((x) => i & x).map((x) => x != 0).map(Number);
        return bits.join("");
    }
}

function iprange2cidr(start, end) {
    const ret = [];
    const iMask = function (s) {
        return (2 ** 32 - 2 ** (32 - s));
    }

    while (end >= start) {
        let maxSize = 32;
        while (maxSize > 0) {
            const mask = iMask(maxSize - 1);
            const maskBase = (start & mask) >>> 0;  // cast to unsigned
            if (maskBase != start) {
                break;
            }
            maxSize -= 1;
        }

        const x = Math.log(end - start + 1) / Math.log(2);
        const maxDiff = Math.floor(32 - Math.floor(x));

        if (maxSize < maxDiff) {
            maxSize = maxDiff;
        }

        ret.push([IPv4.IntToString(start), maxSize].join("/"));
        start += 2 ** (32 - maxSize);
    }

    return ret;
}