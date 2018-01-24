# boop

A multiplayer party game similar to [bumper balls from Mario Party](https://www.youtube.com/watch?v=27VH-0ua25k).

Play it here: http://boopjs.herokuapp.com

### Installing and running locally

Install [Redis](https://redis.io/topics/quickstart)

In a terminal run `$ redis-server`
Then, in a separate terminal run:
```
$ git clone https://github.com/ScottyFillups/boop.git
$ yarn install
$ yarn run start
```

You should be able to access the site at http://localhost:8080

### Contributing

* __When adding a new feature, create a new branch: do not push to master__
* __Run `yarn run lint` before you commit__
  * Run `yarn run fix` to fix any fixable errors
* Use `yarn run dev` rather than `yarn run start`
* In a separate tab, run `yarn run watch` to make webpack build client code

When new code is merged to master, Travis will automatically deploy to Heroku. No need to deploy it yourself :smiley:
