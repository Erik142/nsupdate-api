var shelljs = require('shelljs')
var config = require('../config/config')

exports.post = async function (req, res) {
    var hostname = req.body.hostname
    var ipv4address = req.body.ipv4address
    var ttl = req.body.ttl
    var recordType = req.body.recordType

    try {
        var updateString = buildUpdateString(hostname, ipv4address, ttl, recordType, false)
        executeUpdate(updateString)

        res.send("OK")
    }
    catch (err) {
        res.send({ Error: err.message })
    }
}

exports.delete = async function (req, res) {
    var hostname = req.body.hostname
    var ipv4address = req.body.ipv4address
    var ttl = req.body.ttl
    var recordType = req.body.recordType

    try {
        var updateString = buildUpdateString(hostname, ipv4address, ttl, recordType, true)
        executeUpdate(updateString)

        res.send("OK")
    }
    catch (err) {
        res.send({ Error: err.message })
    }
}

function buildUpdateString(hostname, ipv4address, ttl, recordType, deleteRecord) {
    if (!ttl) {
        ttl = 86400
    }

    if (!recordType) {
        recordType = "A"
    }

    if (!hostname || !ipv4address) {
        throw Error("Hostname or IpV4 address cannot be null")
    }

    ipv4ReversedAddress = "";
    digits = ipv4address.toString().split(".")
    digits.reverse()

    digits.forEach(digit => {
        ipv4ReversedAddress += digit.toString() + "."
    });

    ipv4ReversedAddress = ipv4ReversedAddress.slice(0, -1)

    updateString = "";
    updateString += "server " + config.server + "\n"
    updateString += "update delete " + hostname + " " + recordType + "\n"

    if (!deleteRecord) {
        updateString += "update add " + hostname + " " + ttl + " " + recordType + " " + ipv4address + "\n"
    }

    updateString += "\n"
    updateString += "update delete " + ipv4ReversedAddress + ".in-addr.arpa PTR\n"

    if (!deleteRecord) {
        updateString += "update add " + ipv4ReversedAddress + ".in-addr.arpa " + ttl + " PTR " + hostname + "\n"
    }

    updateString += "send"

    return updateString
}

function executeUpdate(updateString) {
    var nsupdate = shelljs.which("nsupdate")

    if (!nsupdate) {
        throw Error("nsupdate command was not found on the system.")
    }

    console.log("Executing nsupdate...")
    nsupdate = shelljs.exec("echo \"" + updateString + "\" | nsupdate -k " + config.keyPath)
    console.log("Finished executing nsupdate!")

    if (nsupdate.code != 0) {
        throw Error("An error occured when updating the DNS record: " + nsupdate.stderr)
    }
}