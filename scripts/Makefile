all: download parse

download:
	./dumpcat.py --category 'Is a genoset' --with-subpage 'criteria'
	./dumpcat.py --category 'Is a snp'
	./dumpcat.py --category 'Is a genotype'

parse:
	./parsegenosets.py
	./parsesnps.py
	./parsegenotypes.py

clean:
	rm -rf *.xml *.json throttle.ctrl apicache
