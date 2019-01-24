module.exports = async function (cli) {
    console.log('my custome JS bootstrap script');
    const tx = await cli.createEntryCreditPurchaseTransaction('FA2jK2HcLnRdS94dEcU27rF3meoJfpUcZPSinpb7AwQvPRY6RL1Q', 'EC2vXWYkAPduo3oo2tPuzA44Tm7W6Cj7SeBr3fBnzswbG5rrkSTD', 10000);
    await cli.sendTransaction(tx);
};
