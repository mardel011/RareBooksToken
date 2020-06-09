const BigNumber = require("bignumber.js");
const truffleAssert = require("truffle-assertions");
const Book = artifacts.require('Book');


contract("Book", accounts => {
    const tokenNameExpected = "Book Token";
    const tokenSymbolExpected = "BT";
    const tokenSupplyExpected = web3.utils.toBN(10000000000000000000);
    const creator = accounts[0];
    const receipient1 = accounts[1];
    const receipient1Amount = web3.utils.toBN(500000000000000000);
    const spender = accounts[2];
    const spenderAmount = web3.utils.toBN(300000000000000000);
    const receipient2 = accounts[3];
    let BookInstance;
    before(async () => {
        BookInstance = await Book.deployed();
        const name = await Book.name.call();
        assert.equal(name, tokenNameExpected, "Token is not as expected");
        assert.equal(
            symbol,
            tokenSymbolExpected,
            "Token symbol is not as expected"
          );

    it("test balanceOf()", async () => {
        const tokenBalanceInCreator = await BookInstance.balanceOf.call(
          creator
        );
        assert(
          new BigNumber(tokenBalanceInCreator).isEqualTo(
            new BigNumber(tokenSupplyExpected)
          ),
          "The initial balance of creator is not as expected"
        );
    
      it("test transfer()", async () => {
        const creatorOldBalanceFromContract = await BookInstance.balanceOf(
          creator
        );
        const tx = await BookInstance.transfer(
          receipient1,
          receipient1Amount,
          { from: creator }
        );
        const receipient1Balance = receipient1Amount;
        const receipientBalFromContract = await BookInstance.balanceOf(
          receipient1
        );
        const creatorBalanceFromContract = await BookInstance.balanceOf(
          
        );
        const creatorExpectedBalance = web3.utils
          .toBN(creatorOldBalanceFromContract)
          .sub(web3.utils.toBN(receipient1Amount));
        assert(
          new BigNumber(creatorBalanceFromContract).isEqualTo(
            new BigNumber(creatorExpectedBalance)
          )
        );
        truffleAssert.eventEmitted(tx, "Transfer", obj => {
          return (
            obj.from === creator &&
            obj.to === receipient1 &&
            new BigNumber(receipient1Amount).isEqualTo(new BigNumber(obj.value))
          );
        });
        assert(
          new BigNumber(receipient1Balance).isEqualTo(receipientBalFromContract),
          "The receipient1's balance is not as expected"
        );
    });
    
      it("test transferFrom()", async () => {
        const oldReceipient1Balance = await BookInstance.balanceOf.call(
          receipient1
        );
        const approveTx = await BookInstance.approve(
          spender,
          spenderAmount,
          { from: receipient1 }
        );
        truffleAssert.eventEmitted(approveTx, "Approval", obj => {
          return (
            obj.owner === receipient1 &&
            obj.spender === spender &&
            new BigNumber(obj.value).isEqualTo(spenderAmount)
          );
        });
        const transferfromTx = await BookInstance.transferFrom(
          receipient1,
          receipient2,
          spenderAmount,
          { from: spender }
        );
        truffleAssert.eventEmitted(transferfromTx, "Transfer", obj => {
          return (
            obj.from === receipient1 &&
            obj.to === receipient2 &&
            new BigNumber(obj.value).isEqualTo(spenderAmount)
          );
        });
        const receipient2Balance = await BookInstance.balanceOf(
          receipient2
        );
        assert(
          new BigNumber(spenderAmount).isEqualTo(receipient2Balance),
          "The balance of receipient2 is not as expected"
        );
        const receipient1BalanceFromContract = await BookInstance.balanceOf.call(
          receipient1
        );
        const expectedReceipient1Balance = web3.utils
          .toBN(oldReceipient1Balance)
          .sub(spenderAmount);
        assert(
          new BigNumber(receipient1BalanceFromContract).isEqualTo(
            new BigNumber(expectedReceipient1Balance)
          ),
          "The receipient1's balance is not as expected"
          );
        });
        });
    });
});
