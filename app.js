var express = require('express');
var cors = require('cors');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver').v1

var app = express();
app.use(cors());
// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//  FOR PRODUCTIION: Set up a whitelist and check against it:
// var whitelist = ['https://crystalballvision.herokuapp.com:80/']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// // // Then pass them to cors:
// app.use(cors(corsOptions));


// app.use(function(req, res, next) {
//     res.set({"Access-Control-Allow-Origin": "*",
//         "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
//     });
//     // res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.use(logger('dev')); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'react/build')));

// var driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'OOSH00sh!'), { disableLosslessIntegers: true })
var driver = neo4j.driver('bolt://hobby-hnghhenlakdagbkefbhbojdl.dbs.graphenedb.com:24787', neo4j.auth.basic('wahve', "b.ZLZrpCKZjely.Jmw4EBJRstvfmbqY"), { disableLosslessIntegers: true })

var session = driver.session()

app.get('/data', (req, res) => {
    var graph = {"nodes": [],
            "links" :[]}

    Promise.all([
        session.run("match (n) return n.name, labels(n), id(n)"),
        session.run("match (s:TableNames)-[r:HAS]-(t:ID) return id(s), id(t), type(r)"),
        ])
        .then((results) => {
            
            var nodeArr = []
            results[0].records.forEach(record => {
                nodeArr.push({
                   name: record._fields[0],
                   label: record._fields[1][0],
                   id: record._fields[2],
                });
            });
            graph['nodes'] = nodeArr

            var relArr = []
            results[1].records.forEach(record => {
                relArr.push({
                    source: record._fields[0],
                    target: record._fields[1],
                    id: record._fields[2],
                })
            })
            graph['links'] = relArr
            res.send(graph)
            console.log('82', graph)
        })
        .catch((error) => session.close())
        console.log('85', '????')

});

const port = process.env.PORT || 5000;

var listener = app.listen(port, function(){
    console.log('Listening on port ' + listener.address().port); //Listening on port 8888
});


module.export = app;