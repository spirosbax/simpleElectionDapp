var contractAddress = '0xd025891b3ebd8438f81cb4a0d168c42fb9cd073f'
var votingInstance

$.notify.defaults({
    autoHideDelay: 10000
})

async function startApp() {
    web3 = new Web3(Web3.givenProvider)
    if (web3.currentProvider == null) {
        alert("Please visit https://metamask.io/ and install MetaMask")
    }

    await web3.eth.getAccounts()
        .then((accounts) => {
            if (accounts[0] == undefined) {
                alert("Please login to MetaMask")
            }
            web3.eth.defaultAccount = accounts[0]
            console.log("Default account is " + accounts[0])
        })
        .catch((error) => {
            console.log(error)
        })


    if(web3.eth.net.isListening()) {
        $.notify("Connected", "success")
        console.log("Connected")
    } else {
        $.notify("Not Connected", "error")
        console.log("Not connected")
    }
    acknowlegdeNetwork(web3)
    var votingInstance = new web3.eth.Contract([{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidates","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"}],"name":"addNewCandidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"}],"name":"deleteCandidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"getCandidateVotes","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCandidateList","outputs":[{"name":"","type":"bytes32[]"}],"payable":false,"stateMutability":"view","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_name","type":"bytes32"}],"name":"NewCandidateAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_name","type":"bytes32"}],"name":"VotedCandidate","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_name","type":"bytes32"}],"name":"DeletedCandidate","type":"event"}],
        contractAddress,
        {from: web3.eth.defaultAccount}
    )
    return votingInstance
}


var grid  = new Vue({
    el: '#demo',
    data: {
        searchQuery: '',
        gridColumns: ['name', 'votes'],
        gridData: []
    },
    async created() {
        votingInstance = await startApp()
        this.fetchData()
    },
    methods: {
        fetchData: () => {
            grid.gridData = []
            votingInstance.methods.getCandidateList()
                .call()
                .then((list) => {
                    $.each(list, (index, value) => {
                        votingInstance.methods.getCandidateVotes(value)
                            .call()
                            .then((votes) => {
                                console.log(value,votes)
                                grid.gridData.push({name: web3.utils.toUtf8(value), votes: votes})
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }
})


var addButton = new Vue({
    el: "#add-new",
    data: {
        name: ""
    },
    methods: {
        addNewCandidate: (name) => {
            votingInstance.methods.addNewCandidate(web3.utils.fromAscii(name))
                .send()
                .once('transactionHash', (hash) => {
                    inform("created", hash)
                })
                .on("error", (error) => {
                    console.log(error)
                })
                .then((receipt) => {
                    inform("receipt", receipt)
                })
        }
    }
})

var updateBox = new Vue({
    el:"#update-box",
    data: {
        message: ""
    }
})

// register the grid component
Vue.component('demo-grid', {
    template: '#grid-template',
    props: {
        data: Array,
        columns: Array,
        filterKey: String
    },
    data: function() {
        var sortOrders = {}
        this.columns.forEach(function(key) {
            sortOrders[key] = 1
        })
        return {
            sortKey: '',
            sortOrders: sortOrders
        }
    },
    computed: {
        filteredData: function() {
            var sortKey = this.sortKey
            var filterKey = this.filterKey && this.filterKey.toLowerCase()
            var order = this.sortOrders[sortKey] || 1
            var data = this.data
            if (filterKey) {
                data = data.filter(function(row) {
                    return Object.keys(row).some(function(key) {
                        return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                    })
                })
            }
            if (sortKey) {
                data = data.slice().sort(function(a, b) {
                    a = a[sortKey]
                    b = b[sortKey]
                    return (a === b ? 0 : a > b ? 1 : -1) * order
                })
            }
            return data
        }
    },
    filters: {
        capitalize: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
    },
    methods: {
        sortBy: function(key) {
            this.sortKey = key
            this.sortOrders[key] = this.sortOrders[key] * -1
        },
        voteForCandidate: function(name) {
            votingInstance.methods.voteForCandidate(web3.utils.fromAscii(name))
            .send()
            .once('transactionHash', (hash) => {
                inform("created", hash)
            })
            .on("error", (error) => {
                console.log(error)
            })
            .then((receipt) => {
                inform("receipt", receipt)
            })
        }
    }
})



function acknowlegdeNetwork(web3) {
    web3.eth.net.getId().then((netId) => {
        switch (netId) {
            case 1:
                $.notify('This is mainnet', "info")
                console.log('This is mainnet')
                break
            case 2:
                $.notify('This is the deprecated Morden test network', "info")
                console.log('This is the deprecated Morden test network.')
                break
            case 3:
                $.notify("This is the Ropsten Test Network", "info")
                console.log("This is the Ropsten Test Network.")
                break
            case 4:
                $.notify('This is the Rinkeby test network', "info")
                console.log('This is the Rinkeby test network.')
                break
            case 42:
                $.notify('This is the Kovan test network', "info")
                console.log('This is the Kovan test network.')
                break
            default:
                $.notify('This is an unknown network', "warn")
                console.log('This is an unknown network.')
        }
    })
}


function inform(op, data) {
    switch(op) {
        case "created":
            console.log("Created transaction with hash: ", data)
            updateBox.message = "Created transaction with hash: " + data
            console.log("Transaction link:" + " https://ropsten.etherscan.io/tx/" + data)
            updateBox.message = "Transaction link:" + " https://ropsten.etherscan.io/tx/" + data
            console.log("Pending Confirmation...")
            $.notify("Pending Confirmation...", {
                className: "info",
                autoHide: false
            })
            break
        case "receipt":
            $('.notifyjs-corner').empty();
            notifyAndLog("Transaction Accepted!", op="success")
            console.log(data)
            updateBox.message = "Transaction Accepted!\n"
            updateBox.message += JSON.stringify(data)
            grid.fetchData()
            break
    }
}

function notifyAndLog(message, data = "", op = "") {
    $.notify(message, op)
    console.log(message, data)
}
