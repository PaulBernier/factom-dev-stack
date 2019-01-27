module.exports = async function (cli, { Chain, Entry }) {
    console.log('My custom JS bootstrapping script');
    
    const tx = await cli.createEntryCreditPurchaseTransaction('FA2jK2HcLnRdS94dEcU27rF3meoJfpUcZPSinpb7AwQvPRY6RL1Q', 'EC3b6ph71PXiXorFnStNNPNP8mF4YkZMQwQxH4oNs52HvXiXgjar', 10000);
    await cli.sendTransaction(tx);

    const entry = Entry.builder()
        .extId('test', 'utf8')
        .content('hello', 'utf8')
        .build();

    const c = new Chain(entry);
    await cli.add(c, 'EC3b6ph71PXiXorFnStNNPNP8mF4YkZMQwQxH4oNs52HvXiXgjar');
};
