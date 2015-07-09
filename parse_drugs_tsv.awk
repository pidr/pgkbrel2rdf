BEGIN { print "Début du parcours"
FS="\t" }
{
pharmgkb_id = $1
split($10,xref,",")
for (i in xref) { 
	if(match(xref[i],/("UMLS:.*)/)) {
		gsub(/"UMLS:/,"", xref[i])
		gsub(/\(.*/, "", xref[i])
		print pharmgkb_id,xref[i]
	}
}
}
END { print "-- Parcours terminé --" }
