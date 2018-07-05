//Copyright menouer nobach -  www.menouernobach.nl
let PDK = require('node-pinterest');
let pinterest = PDK.init('');
let mysql = require('mysql');
let moment = require('moment');



let connection = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: '',
});


connection.connect(function(err) {
    if (err)
        throw err;
    else {
        console.log('Pinterest API has connected to MySQL');



    }




    let options = {
        qs: {
            fields: "id,url,created_at,note",
            limit: 100


        }

    };

    pinterest.api('me/pins', options).then(function (json) {
        console.log("Requesting api call");
        console.log("API call succesfully made");
        let stringify = JSON.stringify(json.data);
        let parsed = JSON.parse(stringify);



        for (let i = 0; i < parsed.length; i++) {

            let time = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
            let data = [
                [0,parsed[i].id,parsed[i].url,parsed[i].note,parsed[i].created_at,'0','Pinterest',time]
            ];

                    let sql = "INSERT INTO stats_socials (ss_m_id,ss_id_soc,ss_postlink,ss_text,ss_date,ss_aantal,ss_type,ss_last_update) VALUES ? ON DUPLICATE KEY UPDATE ss_id_soc=ss_id_soc";
                    connection.query(sql, [data], function (err, result) {
                        if (err) throw err;
                        console.log("Pinterest added rows  " + result.affectedRows);
                    });



        }


    });

});


setTimeout((function() {
    return process.exit(22);
}), 15000);
