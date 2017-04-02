var builder = require('botbuilder');


module.exports = [


function (session)
{
   
    

  //dummy object - get this from database
  //@todo: get pending approvals
  var productsToCompare = [{"prodId":123,"prodName":"prod1","description":"Sample Product 1", "price": 400 },{"prodId":342,"prodName":"prod-2","description":"Prod-2", "price": 550}]

    
     var message = new builder.Message()
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(productsToCompare.map(productsAsAttachments));
     session.send(message);
     session.endDialog(); 
}
    
];

// Helpers
function productsAsAttachments(product) {
    return new builder.HeroCard()
        .title(product.prodName)
        .subtitle("Product Price: " + product.price)
        .buttons([
           builder.CardAction.dialogAction(null, "AddToCart", product.prodId, "Add to Cart"),
           builder.CardAction.dialogAction(null, "BuyNow", product.prodId, "Buy Now"), 
        ]);
}


