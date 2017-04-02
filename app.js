// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 4949, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    // appId: process.env.MICROSOFT_APP_ID,
    // appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var DialogLabels = {
    CompareProducts: 'Compare Products',
    GetDeals : 'Get Deals',
    GetCoupons: 'Get Coupons'
};

var bot = new builder.UniversalBot(connector, [
    function (session) {
        // prompt for Menu options
        builder.Prompts.choice(
            session,
            'Hi, what are you looking for?',
            [DialogLabels.CompareProducts, DialogLabels.GetDeals, DialogLabels.GetCoupons],
            {
                maxRetries: 3,
                retryPrompt: 'Not a valid option'
            });
    },
    function (session, result) {
        if (!result.response) {
            // exhausted attemps and no selection, start over
            session.send('Ooops! Too many attemps :( But don\'t worry, I\'m handling that exception and you can try again!');
            return session.endDialog();
        }

        // on error, start over
        session.on('error', function (err) {
            session.send('Failed with message: %s', err.message);
            session.endDialog();
        });

        // continue on proper dialog
        var selection = result.response.entity;
        switch (selection) {
            case DialogLabels.CompareProducts:
                return session.beginDialog('CompareProducts');
            case DialogLabels.GetDeals:
                return session.beginDialog('GetDeals');
            case DialogLabels.GetCoupons:
                return session.beginDialog('GetCoupons');
        }
    }
]);

bot.dialog('CompareProducts', require('./CompareProducts'));
bot.dialog('GetDeals', require('./GetDeals'));
bot.dialog('GetCoupons', require('./GetCoupons'));

bot.beginDialogAction("AddToCart", "/AddToCart");
bot.beginDialogAction("BuyNow", "/BuyNow");


//AddProductToCart
bot.dialog('/AddToCart', [
    function (session, args) {
        session.dialogData.productId = args.data;
        session.send("Added Product to Cart....");
        session.endDialog(session.dialogData.productId);
        // builder.Prompts.text(session, 'Any Comments about this approval (type N/A for nothing)');
    }
    // ,
    // function (session, results, next) {
    //     session.send("Added Product to Cart....");
    //     session.endDialog(session.dialogData.productId);
    //     // session.beginDialog('GetPendingApprovals');
    // }
]);
   
//Buy Now
bot.dialog('/BuyNow', [
   function (session, args) {
        session.dialogData.productId = args.data;
        // builder.Prompts.text(session, 'Any Comments about this Rejection (type N/A for nothing)');
        session.send("Buying Product....");
        session.endDialog(session.dialogData.productId);
    }
    // ,
    // function (session, results, next) {
    //     session.send("Buying Product....");
    //     session.endDialog(session.dialogData.productId);
    //     // session.beginDialog('GetPendingApprovals');
    // }
]);


// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});