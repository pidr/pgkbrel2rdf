# sources2rdf
Transform data from sources files to RDF

## Requiremenents

Theses tools only requires NodeJS (tested with v0.20.0).

## Procedure

- Clone this repository
- Create a ./rdf directory
- Copy or move relationships.tsv / medispan_indication.csv / medispan_adverse.csv file(s) to the root of the repo
- Launch the script : node ./[nameOfTheScript].js (e.g node ./pharmgkb_relations.js)
- That's it ! Your turtle file should be in the ./rdf directory.

