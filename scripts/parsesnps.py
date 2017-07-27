#!/usr/bin/env python3

import mwparserfromhell
import utils
import sys
import re


def parse_snps():
    # TODO: {{ClinVar}}

    for page in utils.iter_dump('Is a snp'):
        ptitle = page.title.cdata
        ptext = page.revision.text.cdata
        name = ptitle[0].lower() + ptitle[1:]

        paramMap = {
            'stabilizedOrientation': 'r',
            'chromosome': 'c',
            'position': 'p',
            'summary': 's',
            'gene_s': 'genes',
            'gene': 'gene',
        }

        parsed = mwparserfromhell.parse(ptext)
        snpinfo = {}
        snpinfo.update(utils.extract_parameters(parsed, ['rsnum', '23andMe SNP'], paramMap))

        if 'position' in snpinfo:
            snpinfo['position'] = utils.filter_value(int, snpinfo['position'])

        if 'gene_s' in snpinfo:
            snpinfo['genes'] = [g.strip() for g in snpinfo['gene_s'].split(',')]
            snpinfo.pop('gene_s', None)
            snpinfo.pop('gene', None)
        elif 'gene' in snpinfo:
            snpinfo['genes'] = [snpinfo['gene'].strip()]
            snpinfo.pop('gene', None)

        for template in parsed.ifilter_templates(recursive=False):
            if utils.normalize_name(template.name.strip_code()) not in ['rsnum', '23andMe SNP']:
                continue

            snpinfo['t'] = []
            for n in range(1, 9):
                param = 'geno' + str(n)
                if template.has(param):
                    g = template.get(param).value.strip_code().strip().replace(':', ';')
                    matches = re.match('\(([AGCTDIN-]*) *\;([AGCTDIN-]*) *\)', g)

                    if not matches:
                        print('{}: Genotype {} invalid'.format(name, g))
                        continue

                    allele1 = matches.group(1).replace('D', '-')
                    allele2 = matches.group(2).replace('D', '-')

                    if allele1 == '':
                        allele1 = '-'
                    if allele2 == '':
                        allele2 = '-'

                    # genotypePage = '{}({};{})'.format(name, allele1, allele2)

                    snpinfo['t'].append(allele1 + allele2)

            parsed.remove(template, recursive=False)
            break

        # snpinfo['d'] = str(parsed)

        yield(name, snpinfo)


if __name__ == '__main__':
    snps = utils.run_parser(parse_snps)
    minus = [name for name, details in snps.items() if details.get('r', None) == 'minus']

    # "Compress" the list
    rsids = sorted([int(item[2:]) if item.startswith('rs') else sys.exit(1) for item in minus])

    gaps = []
    conseq = 0
    gaps.append(rsids[0])
    for pos in range(1, len(rsids)):
        diff = rsids[pos] - rsids[pos - 1]
        if diff > 1:
            # gap
            if conseq:
                gaps.append(-1 * conseq)
            gaps.append(diff)
            conseq = 0
        elif diff == 1:
            # conseq
            conseq += 1
        else:
            print("Found duplicate rsIDs. You've got bad data.")
            sys.exit(1)

    if conseq:
        gaps.append(-1 * conseq)

    files = {
        'snps.json': snps,
        'minussnpgaps.json': gaps,
    }
    utils.write_files(files)
