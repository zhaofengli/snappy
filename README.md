# Snappy

![Screenshot](https://zhaofengli.github.io/snappy/static/screenshot.png)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fzhaofengli%2Fsnappy.svg?type=shield)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fzhaofengli%2Fsnappy?ref=badge_shield)

Snappy helps you browse through and interpret your genotype data, right on your
browser. It accepts raw genotype files from 23andMe, AncestryDNA and
FamilyTreeDNA. All processing is done on the browser, without sending sensitive
data over the wire.

This is a prototype, and many things don't work right now. Expect crappy code
and frequent crashes caused by high memory use. But you can help make it
better!

If you haven't tested yet, SNPedia has [a good outline][snpedia-testing] of
genetic testing services, including cost and SNP coverage. Snappy also has an
option to use 23andMe's sample data if you'd like to play around.

## Getting started

You need [Yarn][yarn] to install dependencies. Simply run `yarn` then
`yarn run dev` to fire up the dev server. To build for production, run
`yarn run build`.

`npm` will work, but it's not recommended. Cats love yarn, and you will love
it, too.

### (Optional) Download latest data from SNPedia

Snappy depends on data from [SNPedia][snpedia] to work. A copy is included in
the repo but may be out-of-date. To generate an updated copy, you need Python
3:

```bash
cd scripts
pip3 install -r < requirements.txt
make
```

The scripts will download and parse SNPedia, finally generating JSON files
Snappy can consume. Copy those files to `data`.

## Hacking

Snappy follows the [Airbnb style guide][airbnb-javascript] with a few
restrictions removed, as defined in `.eslintrc.js`. Most of the interesting
stuff happen in `src/snappy`, which you can import elsewhere with
`import MyModule from '@/snappy/MyModule';`. By the way, you are more than
welcome to suggest large, breaking changes! Have fun :)

## Licensing

Snappy is licensed under the BSD 2-Clause License. See `LICENSE.md` for
details.

This project depends on certain third-party packages. Run `yarn licenses ls` to
show their respective licenses.

This repository includes third-party materials. See `THIRDPARTY.md` for details.


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fzhaofengli%2Fsnappy.svg?type=large)](https://app.fossa.io/projects/git%2Bhttps%3A%2F%2Fgithub.com%2Fzhaofengli%2Fsnappy?ref=badge_large)

## Acknowledgments

Snappy is inspired by [Promethease][promethease], [GENOtation][genotation] and
other tools aiming to help people understand their genetic information.

This project would not be possible without:

- [SNPedia](https://www.snpedia.com/)
- [dna2json](https://github.com/genomejs/dna2json) 
- [gql](https://github.com/genomejs/gql)
- [Vue.js](https://vuejs.org/) and friends
- [PEG.js](https://pegjs.org/)

[yarn]: https://yarnpkg.com
[snpedia]: https://www.snpedia.com/
[snpedia-testing]: https://www.snpedia.com/index.php/Testing
[airbnb-javascript]: https://github.com/airbnb/javascript
[promethease]: https://promethease.com/
[genotation]: http://genotation.stanford.edu/