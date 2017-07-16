#!/usr/bin/env python3

import mwparserfromhell
import utils


def parse():
    for page in utils.iter_dump('Is a genoset'):
        ptitle = page.title.cdata
        ptext = page.revision.text.cdata
        name = utils.normalize_name(ptitle.split('/')[0])

        if '/criteria' in ptitle:
            ptext = ptext.replace(' ', '')
            gsinfo = {
                'c': ptext,
            }
            yield (name, gsinfo)
        else:
            paramMap = {
                'repute': 'r',
                'magnitude': 'm',
                'summary': 's',
            }

            parsed = mwparserfromhell.parse(ptext)
            gsinfo = utils.extract_parameters(parsed, 'genoset', paramMap, delete=True)

            # gsinfo['d'] = str(parsed)
            if 'm' in gsinfo:
                gsinfo['m'] = utils.filter_value(float, gsinfo['m'])

            yield (name, gsinfo)


if __name__ == '__main__':
    genosets = utils.run_parser(parse)

    files = {
        'genosets.json': genosets,
    }
    utils.write_files(files)
