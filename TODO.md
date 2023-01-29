# TODO

## Other forks
Check changes of other forks, specifically this one:
- https://github.com/zhaofengli/snappy/compare/master...ravelab:snappy:master

none of the other forks listed here (https://github.com/zhaofengli/snappy/network/members)


also check PR's open,
- https://github.com/zhaofengli/snappy/pulls

## Python2
Some stuff uses Python2, this seemed to be an issue getting node-sass(?) working, replacing with sass didn't work directly. Probably migration required

The reason why it impacted node-sass was because node-sass uses node-gyp, which I believe requires Python2 (unsure, will need to validate)

## Upgrade core-js
```
=> => # npm WARN deprecated tar@2.2.1: This version of tar is no longer supported, and will not receive security updates. Please upgrade asap.
=> => # npm WARN deprecated tar@2.2.1: This version of tar is no longer supported, and will not receive security updates. Please upgrade asap.
=> => # npm WARN deprecated tar@2.2.1: This version of tar is no longer supported, and will not receive security updates. Please upgrade asap.
=> => # npm WARN deprecated core-js@2.5.0: core-js@<3.23.3 is no longer maintained and not recommended for usage due to the number of issues. Because of the V8 engine whims, feature detection in old core-js versions could cause a
=> => # slowdown up to 100x even if nothing is polyfilled. Some versions have web compatibility issues. Please, upgrade your dependencies to the actual version of core-js.
```

## Upgrade
```azure
=> => # npm WARN deprecated axios@0.16.2: Critical security vulnerability fixed in v0.21.1. For more information, see https://github.com/axios/axios/pull/3410

```

## Add Snyk / etc for automated vuln scanning

## Add `npm audit` if not Snyk

## Add GitHub Actions


## Dockerfile
- Need to figure out best way to build for dev/prod.
- yarn must take an option to ignore devDependencies based on target env
- Entrypoint will also change
- Multiple Dockerfiles? Or for entrypoint, a wrapper.sh script which checks ENVIRONMENT env var and runs yarn run dev/yarn run build
