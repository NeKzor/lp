# lp

## TODO

- ~~Implement extractor permission checks~~
- Collection for logs
- Better error responses
- Custom validations
- Convert JSX to TSX
- Remove unused stuff
- Replace CI with unit tests
- Allow video submissions
  - ~~Auth with Steam~~
  - Update UI
- ~~Figure out how SSL/TLS works~~
- ~~Windows? Nahh~~

## Installation

### Requirements

- [NodeJs/npm](https://nodejs.org/en/download)
- [Rust/Cargo](https://www.rust-lang.org/learn/get-started)
- [mongoDB](https://www.mongodb.com/try/download/community)
- [Steam API key](https://steamcommunity.com/dev) - required for ISteamUser data fetch on login
- Optional: [rust-analyzer](https://rust-analyzer.github.io/manual.html#installation) - best analyzer out there at the moment
- Optional: [mongoDB Compass](https://www.mongodb.com/try/download/compass) - database viewer
- Optional: [mkcert](https://github.com/FiloSottile/mkcert) - generate self-signed certs for local ssl tests

### Setup

- Create `lp` database and a user who can access it
- Create `.env` in repository dir:

```.env
STEAM_API_KEY=xxx
DB_NAME=lp
DB_USER=user
DB_PASS=yes
DB_PORT=27017
```

- Configure `run`
- Start database with `./run db` in separate terminal or process
- Start server with `./run server` (use --help for additional info)

### Development

- `./run app` serves the client app
- `./run book` serves the rules book
- `./run db` starts db instance
- `./run populate-records` downloads and inserts latest records data
- `./run server -d` starts server in dev mode

### Reference & Notes

Need this so I don't forget lol.

- [mongoDB createUser](https://docs.mongodb.com/manual/reference/method/db.createUser)
- [actix/examples](https://github.com/actix/examples)
- [material-ui styles api](https://material-ui.com/styles/api), look into upcoming v5 api
- Cannot use u8/u16/u32/u64 in data models because mongoDB only supports signed integer types
