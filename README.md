# MonitorApi
Api to collect users activity from website, live at: [https://monitor-api-nine.now.sh/](https://monitor-api-nine.now.sh/)


# Introduction
It was created to track users activity of [Vegetarian Shop](https://vegeshop-714fb.firebaseapp.com/). Api collects such information about user as location, track users cart, device and much more into mongoDB database. Such data can be easy access in formatted form, as users data, average data for user, or global values in total and average form. It is easy to implement with different shops, so users data can be displayed with applications, that can't read it from google analytics.

# Technologies
Center of api is powered by NestJS framework. Thanks to it API is written in typeScript and easy compiling to native JS. Tests was written in JestJS framework which make checking routes data and errors catch possible directly from build directory.

# Setup
To make api work:
1. install NestJS and mongoose:
- Install NestJS CLI: `-g @nestjs/clit`
- Install mongoose: `npm install mongoose`
- Install mongoose for nestJS: `npm install @nestjs/mongoose`
2. Set root of MongoDB database in app.module.ts
3. Run

# Resource components
List of API components:


| resource      | requirements        |result        |
|:--------------|:--------------------|:-------------|
| Post `/sessions` | User Ip, Date of visit, Device, Browser, Location, reffer | Post into database the information about new Session |
| `/works`      | returns a list of all works (journal articles, conference proceedings, books, components, etc), 20 per page
| `/funders`    | returns a list of all funders in the [Funder Registry](https://github.com/Crossref/open-funder-registry)
| `/members` | returns a list of all Crossref members (mostly publishers) |
| `/types`      | returns a list of valid work types |
| `/licenses`  | return a list of licenses applied to works in Crossref metadata |
| `/journals` | return a list of journals in the Crossref database |
| `/journals` | return a list of journals in the Crossref database |
| `/journals` | return a list of journals in the Crossref database |
| `/journals` | return a list of journals in the Crossref database |
| `/journals` | return a list of journals in the Crossref database |
| `/journals` | return a list of journals in the Crossref database |
| `/journals` | return a list of journals in the Crossref database |
| `/journals` | return a list of journals in the Crossref database |
| `/journals` | return a list of journals in the Crossref database |
| `/journals` | return a list of journals in the Crossref database |
| `/journals` | return a list of journals in the Crossref database |
| `/journals` | return a list of journals in the Crossref database |
| `/journals` | return a list of journals in the Crossref database |
| `/journals` | return a list of journals in the Crossref database |
| `/journals` | return a list of journals in the Crossref database |
| `/journals` | return a list of journals in the Crossref database |
| `/journals` | return a list of journals in the Crossref database |
| `/journals` | return a list of journals in the Crossref database |
| `/journals` | return a list of journals in the Crossref database |
| `/journals` | return a list of journals in the Crossref database |


# Others
### Report Bug and improves

You can report encountered bugs or send ideas for improvement [here](https://github.com/TomaszOrpik/MonitorApi/issues/new)


### License

Application was uploaded under GENERAL PUBLIC LICENSE for more information [check license file](https://github.com/TomaszOrpik/MonitorApi/blob/master/LICENSE) link to license

### Contact

Feel free to [Contact me!](https://github.com/TomaszOrpik)