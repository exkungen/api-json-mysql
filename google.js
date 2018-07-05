var mysql = require('mysql');
var moment = require('moment');

var {google} = require('googleapis');
var plus = google.plus('v1');

var API_KEY = 'AIzaSyA5MwgSiHhAvrEPngrV1gTepcbgN2z-_vs';


var connection = mysql.createConnection({
    host: 'localhost',
    user: 'wonen_2',
    password: 'qwaszx123',
    database: 'wonen_2'
});

connection.connect(function (err) {
    if (err)
        throw err;
    else {
        console.log('Connected to MySQL');
    }

    
    

    plus.activities.list({
        auth: API_KEY,
        userId: '107394136213845021046',
        collection: 'public',
		fields: 'id,items',
		maxResults: '100'
    }, function (err, user) { 
        if (err) throw err;
        var stringify = JSON.stringify(user.data.items);
        var parsed =  JSON.parse(stringify);
       for (var i = 0; i < parsed.length; i++) {
		  
		   var array = [];
		 var itemsStringify = JSON.stringify(parsed[i].object);
		var itemsParsed = JSON.parse(itemsStringify);

		   
		   var itemsStringify1 = JSON.stringify(itemsParsed.attachments);
		        var itemsParsed2 = JSON.parse(itemsStringify1);
	
		   
		   for(var g = 0; g < itemsParsed2.length; g++) {
			 
		var itemsStringify3 = JSON.stringify(itemsParsed2[g].displayName);
		        var itemsParsed4 = JSON.parse(itemsStringify3);
			   array.push(itemsParsed4);
		   }
		   
		   
		   
		   
		   
		   
            var googletime = moment(parsed[i].published).format('YYYY-MM-DD HH:mm:ss');
            var time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');          
            var data = [
                [0,parsed[i].id,parsed[i].url,array,googletime,'0','Google+',time]
            ];
              var sql = "INSERT INTO stats_socials (ss_m_id,ss_id_soc,ss_postlink,ss_text,ss_date,ss_aantal,ss_type,ss_last_update) VALUES ? ON DUPLICATE KEY UPDATE ss_id_soc=ss_id_soc";
            connection.query(sql, [data], function (err, result) {
                if (err) throw err;
                console.log("Google+ has added the following rows " + result.affectedRows);

            });
		   
		   

        }
        
    });
    
    });


setTimeout((function() {
    return process.exit(22);
}), 15000);