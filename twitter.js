let Twitter = require('twitter');
let moment = require('moment');
let mysql = require('mysql');

let client = new Twitter({
    consumer_key: 'wHOEHaDBqKyuN6YGRn3aDhVSA',
    consumer_secret: 'Bfze4blPkhCBI8Z27bsaFlAfWVcU6pyrjkdgkwabXhMph5GuHT',
    access_token_key: '102926425-3S56XvCqBoJUO4brZw9n1Nl9G4yVHfs30CjA3JxY',
    access_token_secret: 'X2m8lhZOL8BvCrdE6HXlGpnstHNPG45ZCZu8lVxy36p0M'
});



let connection = mysql.createConnection({
    host: 'localhost',
    user: 'wonen_2',
    password: 'qwaszx123',
    database: 'wonen_2',
    charset: 'utf8mb4_bin'
});


connection.connect(function(err) {
    if (err)
        throw err;
    else {
        console.log('Twitter API has connected to MySQL');


    }



    let params = {user_id: '102926425', count: '200', id: '1'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (error) {
            console.log(error);
        }
        let tweetsStringify = JSON.stringify(tweets);
        let tweetsParsed = JSON.parse(tweetsStringify);



        for (let i = 0; i < tweetsParsed.length; i++) {

            let time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            // let stringifyEntities = JSON.stringify(tweetsParsed[i].entities);
            // let parsedEntities = JSON.parse(stringifyEntities);
            //
            // let stringifyUrl = JSON.stringify(parsedEntities.urls);
            // let parsedUrl = JSON.parse(stringifyUrl);
            //
            // let urlArray = [];
            // for (let j = 0; j < parsedUrl.length; j++) {
            //     let stringifyExpandedUrl = JSON.stringify(parsedUrl[j].expanded_url);
            //     let parsedExpandedUrl = JSON.parse(stringifyExpandedUrl);
            //      urlArray.push(parsedExpandedUrl);
            //
            // }
            let customUrl = 'http://www.twitter.com/WONENnl/status/' + tweetsParsed[i].id_str;
            // console.log(customUrl);
            let tweettime = moment(tweetsParsed[i].created_time).format('YYYY-MM-DD HH:mm:ss');

            let data = [


                [0,tweetsParsed[i].id_str,customUrl,tweetsParsed[i].text,tweettime,0,'Twitter',time]


            ];

            let sql = "INSERT INTO stats_socials (ss_m_id,ss_id_soc,ss_postlink,ss_text,ss_date,ss_aantal,ss_type,ss_last_update) VALUES ? ON DUPLICATE KEY UPDATE ss_id_soc=ss_id_soc";
            connection.query(sql, [data], function (err, result) {
                if (err) console.log(err);
                console.log("Twitter added rows " + result.affectedRows);
            });
            // connection.query('UPDATE stats_socials SET ? WHERE ?', [{ ss_postlink: customUrl }, { ss_id_soc: tweetsParsed[i].id_str }]);
        }



    });












});
setTimeout((function() {
    return process.exit(22);
}), 15000);