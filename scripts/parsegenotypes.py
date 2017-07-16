#!/usr/bin/env python3

import mwparserfromhell
import utils
import re


def parse_genotypes():
    for page in utils.iter_dump('Is a genotype'):
        ptitle = page.title.cdata
        ptext = page.revision.text.cdata
        name = utils.normalize_name(ptitle)

        # Parse genotype
        matches = re.match('((?:rs|i)[0-9]+)\(([^\)]+)\)', name)

        if not matches:
            print('Genotype {} invalid'.format(name))
            continue

        # Extract info
        paramMap = {
            'repute': 'r',
            'magnitude': 'm',
            'summary': 's',
        }

        parsed = mwparserfromhell.parse(ptext)

        snp = matches.group(1)
        genotype = matches.group(2)
        genotypeinfo = utils.extract_parameters(parsed, 'genotype', paramMap, delete=True)

        if 'D' in genotype or ':' in genotype:
            genotypeinfo['o'] = genotype
            genotype = genotype.replace('D', '-').replace(':', ';')

        if ';' not in genotype:
            print('Ignoring {}'.format(name))

        if 'm' in genotypeinfo:
            if genotypeinfo['m'] == '0':
                genotypeinfo.pop('m', None)
            else:
                genotypeinfo['m'] = utils.filter_value(float, genotypeinfo['m'])

        snpinfo = {}
        snpinfo[genotype] = genotypeinfo

        yield (snp, snpinfo)


if __name__ == '__main__':
    genotypes = utils.run_parser(parse_genotypes)

    files = {
        'genotypes.json': genotypes,
    }
    utils.write_files(files)
