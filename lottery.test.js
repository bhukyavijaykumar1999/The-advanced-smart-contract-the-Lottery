const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const {interface, bytecode} = require('../compile');

let lottery;
let accounts;

beforeEach(async ()=>{
    accounts = await web3.eth.getAccounts();

    lottery = await new web3.eth.Contract(JSON.parse(interface))
                .deploy({data: bytecode})
                .send({from: accounts[0], gas: '1000000'});
});

describe('lottery contract',()=>{
    it('deploy',()=>{
        assert.ok(lottery.options.address);
    });

    it('entering multiple',async ()=>{
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02', 'ether')
        });
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02', 'ether')
        });

        const players = await lottery.methods.getplayers().call({
            from : accounts[0]
        });

        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);
        assert.equal(3,players.length)
    });

    it('no enter', async()=>{
        try{
            await lottery.methods.enter().send({
                from : accounts[3],
                value: 0
        });
        assert(false);
        }catch (err) {
            assert(err);
        }
    });

    it('manager picking',async ()=>{
        try{
            await lottery.methods.pickwinner().send({
                from : accounts[3]
            })
            assert(false)
        }catch(err){
            assert(err)
        }
    })

    it('whole code', async ()=>{
        await lottery.methods.enter().send({
            from : accounts[0],
            value: web3.utils.toWei('2', 'ether')
        });

        const initialbalance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickwinner().send({
            from : accounts[0]
        })

        const finalbalance = await web3.eth.getBalance(accounts[0]);
        const difference = finalbalance - initialbalance;
        assert(difference > web3.utils.toWei('1.8','ether'));
    })

    
});
