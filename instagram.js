let mysql = require('mysql');
let moment = require('moment');
const {Facebook, FacebookApiException} = require('fb');
const FB = new Facebook();
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
        console.log('Instagram API has connected to MySQL');


    }
    FB.api('17841400261636871/', { fields: 'media.limit(85){insights.metric(impressions),permalink,caption,timestamp,id}', access_token:'EAADGAMZAy2GEBADhnyZBScKWDMEmZBi5DSvjVD0lb1OFKus0lb8szOKm1sRBpw57KJbbCvaJGQdjhlAvNR2xIZCRtNdlP6mplI3ZA1KoEZAiUSRQ35lPLGtkEgZCtvHihvWsS9FB7ZB3JZAWHgEvqb0cmamVglBXlq1oZD' }, function (res) {
        let stringify = JSON.stringify(res.media.data);
        let parsed = JSON.parse(stringify);



        for (let i = 0; i < parsed.length; i++) {
            let pushtest = [];
            let test = JSON.stringify(parsed[i].insights);
            let test2 = JSON.parse(test);
            // console.log(test2);
            let test3 = JSON.stringify(test2.data);
            let test2data = JSON.parse(test3);
            for (let j = 0; j < test2data.length; j++) {

                let idk = JSON.stringify(test2data[j].values);
                let idc = JSON.parse(idk);
                pushtest.push(idc[j].value);

            }


            let time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            let instagramtime = moment(parsed[i].timestamp).format('YYYY-MM-DD HH:mm:ss');
            let data = [


                [0,parsed[i].id,parsed[i].permalink,parsed[i].caption,instagramtime,pushtest,'Instagram',time]


            ];

            let sql = "INSERT INTO stats_socials (ss_m_id,ss_id_soc,ss_postlink,ss_text,ss_date,ss_aantal,ss_type,ss_last_update) VALUES ? ON DUPLICATE KEY UPDATE ss_id_soc=ss_id_soc";
            connection.query(sql, [data], function (err, result) {
                if (err) throw err;
                console.log("Instagram has added the following rows" + result.affectedRows);

            });
            connection.query('UPDATE stats_socials SET ? WHERE ?', [{ ss_aantal: pushtest }, { ss_id_soc: parsed[i].id }]);

        }

    });


});

setTimeout((function() {
    return process.exit(22);
}), 15000);