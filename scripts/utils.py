from collections import defaultdict
import untangle
import glob
import json

genosets = {}


# https://stackoverflow.com/a/1094933
def sizeof_fmt(num, suffix='B'):
    for unit in ['', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi', 'Ei', 'Zi']:
        if abs(num) < 1024.0:
            return "%3.1f%s%s" % (num, unit, suffix)
        num /= 1024.0
    return "%.1f%s%s" % (num, 'Yi', suffix)


def run_parser(f):
    result = defaultdict(dict)
    count = 0

    for key, value in f():
        result[key].update(value)
        count += 1

    print('Done. We have {} entries ({} yields).'.format(len(result), count))
    return result


def normalize_name(name):
    name = name.strip()
    return name[0].lower() + name[1:]


def filter_value(f, value):
    if value == '':
        return f()
    else:
        try:
            return f(value)
        except ValueError:
            return f()


def extract_parameters(parsed, tname, mapping, delete=False):
    if type(tname) is not list:
        tname = [tname]

    tname = [normalize_name(n) for n in tname]

    for template in parsed.ifilter_templates(recursive=False):
        rtname = normalize_name(template.name.strip_code())
        if rtname not in tname:
            continue

        result = {}
        for param in template.params:
            rpname = normalize_name(param.name.strip_code())
            if rpname not in mapping:
                continue

            mapped = mapping[rpname]
            result[mapped] = param.value.strip_code().strip()

        if delete:
            parsed.remove(template, recursive=False)

        return result

    return {}


def iter_dump(category):
    for fname in glob.iglob('{}*.xml'.format(category)):
        print('Processing {}'.format(fname))
        dump = untangle.parse(fname)

        for page in dump.mediawiki.page:
            yield page


def write_files(files):
    for fname, data in files.items():
        with open(fname, 'w') as f:
            json.dump(data, f, separators=(',', ':'))
            print('{} written ({})'.format(fname, sizeof_fmt(f.tell())))
