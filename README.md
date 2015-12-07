# sources2rdf
Transform data from sources files to RDF

# Requiremenents

Theses tools only requires NodeJS (tested with v0.20.0).

# pharmgkb_relations.js

This tool aims at transforming PharmGKB relations to .ttl.

## Procedure

- Clone this repository
- Create a ./rdf directory
- Copy or move relationships.tsv file to the root of the repo
- Launch the script : node ./pharmgkb_relations.js
- That's it ! Your turtle file should be in the ./rdf directory.

# medispan_indications.js

