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
// var whitelist = ['http://localhost:3000', 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,500,600,700&amp;subset=cyrillic', 'data:application/font-woff2;base64,d09GMgABAAAAAQ5sABIAAAADuOQAAQ4EAAEAgwAAAAAAAAAAAAAAAAAAAAAAAAAAG4SpIhy4XhSHMgZgAJJmCF4JgnMREAqGskiFyggSgrVoATYCJAOdOAuOXgAEIAWPGAfGYAyDGFsKfLME/nOMvX+HnQoMqyRqK6tt2TW8K2BDX9Umu4PZkCXwtMjpcHYNTx6UUmu30UdwcxxnVMvcNgAim7rdXiPZ////////////C5dF2ObuXM7ZvQeSECARwueHlaLVtkJEIaLRAI3ulswSE13cSPdM15RCyYQuuS7A0mBqpQO9pYZWQQMqa9lQb0dpJzHxHpLyCHIi8uBdwF58nNH+YOA40OpJvEjJtaokKaUkx/N5UeSinp5TWoW1vSpFjimBgeFGeCF66U0n6ZUN/qSqC4XC11GKUNmzSy2d5Jxyqw5JzGUlJUnyi0lKkE8BlxadTZsyRm8c1/Cti2hEjzIH...FVw9csGnQ1BnbMbfzgRj3WjPytwZYWpPh3OtmsLZaNcxxqaGVqMVqFffFpU8bbs/0N1vG3POWfS7LUeB81TfHn+VbD7x/UnT3lXyFltHfdX6+X6Rzmg9d4dAISK7GlTj2zgME/JUwAETAECwABAUgUmAysrKI5shRwAchnFSMheQ8UoKlvnVbkW9mMeq2+bbO9EQ2q09Z9wzsADarYt4ftoamBDi8gmfbZKnl+lkZWyRx1VYVSIpVFXs9VXy9ytCyTNYt09YIAGKjqpDT22SgOdP5OsdAK/vOCXFnrpEwA/PPTJiopB7HxZV+MlaGCT/04K/LY3kjPYV/YR146Ggg+9sX6na/c2So+Epz3PXve3PKRylPIhNZASBUYVDIGhikiWc1jj/claeVCJvljX7JfvO+xhfTDIjSXBs4HV16Ol/BMfcuFQ4NRmDOWEh6diOI6NZmGl87N9J+r2JfpW2+5NhV/fGHLO57Yavbq7zaCewa/RDxp/aSH+luOPwAA', 'https://fonts.gstatic.com/s/opensans/v16/mem5YaGs126MiZpBA-UN_r8OX-hpKKSTj5PW.woff2']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }

// // Then pass them to cors:
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
app.use(express.static(path.join(__dirname, 'react')));



// var driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'OOSH00sh!'), { disableLosslessIntegers: true })
var driver = neo4j.driver('bolt://hobby-hnghhenlakdagbkefbhbojdl.dbs.graphenedb.com:24787', neo4j.auth.basic('wahve', "b.ZLZrpCKZjely.Jmw4EBJRstvfmbqY"), { disableLosslessIntegers: true })
bolt://hobby-hnghhenlakdagbkefbhbojdl.dbs.graphenedb.com:24787
var session = driver.session()

app.get('/', (req, res) => {
    // console.log('BP 0', res);
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
            console.log(graph)
        })
        .catch((error) => session.close())
    
    // session
    //     .run("match (n) return n.name, labels(n), id(n)")
    //     .then(result => {
    //         // console.log("bp1")
    //         var nodeArr = []
    //         // console.log("bp2")
    //         result.records.forEach(record => {
    //             // console.log(record._fields[1])
    //             nodeArr.push({
    //                name: record._fields[0],
    //                label: record._fields[1][0],
    //                id: record._fields[2],
    //             });
    //             // console.log(record._fields[0].properties);
    //         });
    //         // console.log("HERE");
    //         graph['nodes'] = nodeArr
    //         // console.log(graph);
    //         res.render('index', {
    //             nodes: nodeArr
    //         });
    //         // console.log("bp4")
    //         // res.send('it works wow');
    //     })
    //     .run("match (s:TableNames)-[r:HAS]-(t:ID) return id(s), id(t), type(r)")
    //     .then(result => {
    //         var relArr = []
    //         result.records.forEach(record => {
    //             relArr.push({
    //                 source: record._fields[0],
    //                 target: record._fields[1][0],
    //                 type: record._fields[2],
    //             })
    //         })
    //         console.log(relArr)
    //     })
    //     .catch(err => {
    //         // console.log("bp5")
    //         // console.log(err);
    //         // console.log("bp6")
    //     });

    // console.log("bp7")
    // res.send('it works wow');
});

// app.post('/', function(req, res, next) {
//     // Handle the post for this route
// });


const port = process.env.PORT || 5000;
app.listen(port);
console.log('Server started on port ${port}.');


module.export = app;