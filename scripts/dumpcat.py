#!/usr/bin/env python3

import pywikibot
import requests
import click
import math


@click.command()
@click.option('--step', default=5000, help='Number of pages to fetch in one request')
@click.option('--with-subpage', help='Name of subpage to additionally fetch')
@click.option('--category', required=True, help='Name of the category')
def dumpCategory(category, with_subpage='', step=5000):
    """Dumps an entire category on SNPedia"""

    fam = pywikibot.family.AutoFamily('snpedia', 'https://bots.snpedia.com/api.php')
    site = pywikibot.Site(fam=fam, code='snpedia')
    catobj = pywikibot.Category(site, category)
    total = catobj.categoryinfo['pages']

    if with_subpage:
        total *= 2

    print('We are going to download {} pages.'.format(total))
    print('This will take us {} requests.'.format(math.ceil(total / step)))

    pages = [p.title() for p in catobj.articles(recurse=False)]

    if with_subpage:
        pages += ['{}/{}'.format(title, with_subpage) for title in pages]

    for i in range(0, len(pages), step):
        pgroup = pages[i:i + 5000]
        url = 'https://bots.snpedia.com/index.php/Special:Export'
        data = {
            'action': 'submit',
            'pages': '\n'.join(pgroup),
            'curonly': 1,
            'limit': 1,
        }
        r = requests.post(url, data=data)

        fname = '{} {}.xml'.format(category, i)
        with open(fname, 'w') as f:
            f.write(r.text)

        print('Downloaded {}~{}; Written to {}'.format(i, i + step - 1, fname))

    print('Done!')


if __name__ == '__main__':
    dumpCategory()
