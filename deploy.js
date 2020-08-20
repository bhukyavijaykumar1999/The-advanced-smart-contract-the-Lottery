const HDwalletprovider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface,bytecode} = require('./compile');
const provider = new HDwalletprovider(
    'rice hawk roof plug rail topple almost public match hawk menu couple',
    'https://rinkeby.infura.io/v3/8bf475fb9dd5428a92a990ddb3f9b0b3'
);
const web3 = new Web3(provider);

const deploy = async()=>{
    const accounts = await web3.eth.getAccounts();
    console.log('account :',accounts[0])

    result = await new web3.eth.Contract(JSON.parse(interface)).
        deploy({data:'0x' + bytecode}).
        send({from:accounts[0]});
    console.log(interface)
    console.log('contract deployed',result.options.address)
    
};

deploy();

