var aws = require('aws-sdk');

var ses = new aws.SES();


exports.handler = function(event) {
   console.log("Event: ",  event , typeof event );
   
    console.log("Action Event =====> ", event.body );
   let payload = JSON.parse(event.body);

return new Promise((resolve,reject)=>{
    const params = {
        Destination: {
            ToAddresses: ["preeti.bharatandco@gmail.com" , "Priya.bharatandco@gmail.com"]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: createMailContentForReporting({ "payload" :  [ {"name" : payload.name , "number" : payload.number , "email":payload.email ,"message" :payload.message }] },[`Lead/Inquiry Alert -New Lead Added For ${payload.projectName}`])          
                    },
                Text: {
                    Charset: "UTF-8",
                    Data: "FYI"
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data:  `${payload.projectName} Lead` 
            }
        },
        Source: "143varunnagrath@gmail.com"

    };


    //   Send the email
    ses.sendEmail(params, function(err, data) {
        if (err) {
            console.log("SNS Error ====>",err, err.stack);
            // callback(null,"error");
             resolve ({   statusCode : 500 , body: JSON.stringify({ message : "Error" , result : "Error" ,statusCode : 500   }),       headers: {
            'Access-Control-Allow-Origin': 'ekamplot.in',
            'Access-Control-Allow-Credentials': true
        }  });
        }
        else {
            console.log("Success===>",data); // successful response
          resolve( {   statusCode : 200 , body: JSON.stringify({ message : "ok" , result : "Sent" ,statusCode : 200   })  ,      headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        } })
            
            
        }
    });
    
})
    
    
}

function createMailContentForReporting(rows , headingContent) {
  if(Object.keys(rows).length == 0 ) return '';


  let emailContent = "";
  Object.keys(rows).forEach( ( section , ind ) =>{
  let headers = Object.keys(rows[section][0]);
  let content =  headingContent[ind];
  emailContent += `<h3>${ content } </h3> <table cellspacing="0" cellpadding="10" border="0">`;
  let headerRow = `<tr>`;
  for (let key of headers) {
      headerRow += `<th> ${key}</th>`;
  }
  headerRow += `</tr>`;
  let color1 = `#bada55`;
  let color0 = `#55bada`;
  let index = 0;

  for (let row of rows[section]) {
      if (!row || !Object.keys(row).length) {
          continue;
      }
      // if (index % 9 == 0) {
      //     emailContent += headerRow;
      // }


           if (index  == 0) {
          emailContent += headerRow;
      }

      
      emailContent += `<tr style='background-color:${index % 2 ? color1 : color0};'>`;
      index++;
      for (let header of headers) {
          let value = '-';
          if (row[header]) {
              value = row[header];
          }
          emailContent += `<td align="center">${value}</td>`
      }
      emailContent += `</tr>`;
  }
  emailContent += `</table>`;

  emailContent += `<br> <br>`;
})
 console.log(emailContent)
  return emailContent;
}
