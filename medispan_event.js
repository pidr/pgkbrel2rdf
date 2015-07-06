#! /usr/bin/env node

var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var csv = require('csv-streamify');
var N3 = require('n3');

var turtle_dir = "./rdf/";
var medispanEventsPath = "./medispan_event.csv";
var options = { //Options for the csv parser
  delimiter: ',',
  empty: '',
  columns: true
}

  var fstream = fs.createReadStream(medispanEventsPath);
  var  parser = csv(options);
    parser.on('readable', function() {
      parser.setEncoding('utf8');
      var row = parser.read();
      if(row != null) {
        var rowObject = JSON.parse(row);
        getData(rowObject);
      }
    });

    parser.on('finish', function() {
      writer.end(function (error, result) {
        writeToFile(result, "medispan_event.ttl");
      });
    });
  fstream.pipe(parser);

  var writer = N3.Writer({
    prefixes: { 'medispan': 'http://orpailleur.fr/medispan/' }
  });

  function getData(row) {
        var drug = row.drug
        var event = row.event;
        console.log(event);
        writer.addTriple({
          subject:   'http://orpailleur.fr/medispan/'+drug,
          predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
          object:    'http://orpailleur.fr/medispan/drug'
        });

        writer.addTriple({
          subject:   'http://orpailleur.fr/medispan/'+event,
          predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
          object:    'http://orpailleur.fr/medispan/event'
        });

        writer.addTriple({
          subject:   'http://orpailleur.fr/medispan/'+drug,
          predicate: 'http://orpailleur.fr/medispan/side_effect',
          object:    'http://orpailleur.fr/medispan/'+event
        });

      }

  function writeToFile(data, fileName) {
    fs.writeFile(turtle_dir+fileName, data, function(err) {
      if(err) {
        console.log(err);
      }
      console.log("Fichier créé : "+fileName);
    });
  }
