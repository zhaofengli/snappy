#!/usr/bin/env python3

import pywikibot
import requests
import click
import math


@click.command()
@click.option('--step', default=5000, help='Number of pages to fetch in one request')
@click.option('--with-subpage', help='Name of subpage to additionally fetch')
@click.option('--with-indels/--without-indels', default=False, help='Fetch possible indel redirects for Category:Is a genotype')
@click.option('--category', required=True, help='Name of the category')
def dumpCategory(category, with_subpage='', with_indels=False, step=5000):
    """Dumps an entire category on SNPedia"""

    fam = pywikibot.family.AutoFamily('snpedia', 'https://bots.snpedia.com/api.php')
    site = pywikibot.Site(fam=fam, code='snpedia')
    catobj = pywikibot.Category(site, category)

    print('Fetching page list...')

    pages = [p.title() for p in catobj.articles(recurse=False)]

    if with_indels:
        snps = [s.split('(')[0] for s in pages]
        indels = ['(I;I)', '(D;D)', '(D;I)', '(I;D)']
        for snp in snps:
            pages += [snp + indel for indel in indels]

    if with_subpage:
        pages += ['{}/{}'.format(title, with_subpage) for title in pages]

    pages = sorted(set(pages))
    total = len(pages)

    print('We are going to download at most {} pages.'.format(total))
    print('This will take us {} requests.'.format(math.ceil(total / step)))

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
