#! /usr/bin/env node

var fs = require('fs');
var EventEmitter = require('events').EventEmitter;
var csv = require('csv-streamify');
var N3 = require('n3');

var turtle_dir = "./rdf/";
var relationshipsPath = "./relationships.tsv";
var options = { //Options for the csv parser
  delimiter: '\t',
  empty: '',
  columns: true
}

  var fstream = fs.createReadStream(relationshipsPath);
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
        writeToFile(result, "relationships.ttl");
      });
    });
  fstream.pipe(parser);

  var writer = N3.Writer({
    prefixes: { 'pharmgkb': 'http://pharmgkb.org/relationships/' }
  });

  function getData(row) {
        var entity1_id = row.Entity1_id;
        var entity1_name = row.Entity1_name;
        var entity1_type = row.Entity1_type;
        var entity2_id = row.Entity2_id;
        var entity2_name = row.Entity2_name;
        var entity2_type = row.Entity2_type;
        var evidence = row.Evidence;
        var association = row.Association.replace(" ","_");
        var pk = row.PK;
        var pd = row.PD;
        console.log(entity1_id);
        console.log(entity1_type);
        console.log(entity1_name);
        writer.addTriple({
          subject:   'http://pharmgkb.org/relationships/'+entity1_id,
          predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
          object:    'http://pharmgkb.org/relationships/'+entity1_type
        });

        writer.addTriple({
          subject:   'http://pharmgkb.org/relationships/'+entity1_id,
          predicate: 'http://www.w3.org/2000/01/rdf-schema#label',
          object:    '"'+entity1_name+'"'
        });

        writer.addTriple({
          subject:   'http://pharmgkb.org/relationships/'+entity1_id,
          predicate: 'http://pharmgkb.org/relationships/association',
          object:    'http://pharmgkb.org/relationships/'+entity1_id+'_'+entity2_id
        });

        writer.addTriple({
          subject:   'http://pharmgkb.org/relationships/'+entity1_id+'_'+entity2_id,
          predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
          object:    'http://pharmgkb.org/relationships/association'
        });

        writer.addTriple({
          subject:   'http://pharmgkb.org/relationships/'+entity1_id+'_'+entity2_id,
          predicate: 'http://pharmgkb.org/relationships/association_type',
          object:    '"'+association+'"'
        });

        writer.addTriple({
          subject:   'http://pharmgkb.org/relationships/'+entity2_id,
          predicate: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
          object:    'http://pharmgkb.org/relationships/'+entity2_type
        });

        writer.addTriple({
          subject:   'http://pharmgkb.org/relationships/'+entity2_id,
          predicate: 'http://www.w3.org/2000/01/rdf-schema#label',
          object:    '"'+entity2_name+'"'
        });

        writer.addTriple({
          subject:   'http://pharmgkb.org/relationships/'+entity2_id,
          predicate: 'http://pharmgkb.org/relationships/association',
          object:    'http://pharmgkb.org/relationships/'+entity1_id+'_'+entity2_id
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
