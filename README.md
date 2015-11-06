# grunt-ensure-id

> Ensures that all specified html elements has id attribute.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ensure-id --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ensure-id');
```

## The "ensure_id" task

### Overview
In your project's Gruntfile, add a section named `ensure_id` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  ensure_id: {
    options: {
      elements : ['button', 'a'],
      attrs : ['ng-click']
    },
    main: {
      src: ['test/fixtures/*']
    },
  },
});
```

### Options

#### options.elements
Type: `Array`
Default value: `['button', 'a']`

Which HTML elements should have id attribute.

#### options.attrs
Type: `Array`
Default value: `['ng-click', 'ng-submit']`

Which HTML elements which has the above attributes should have id attribute.

### Usage Examples

#### Default Options
In this example, the default options are used to check form html elements without ids. 

```js
grunt.initConfig({
  ensure_id: {
    options: {},
    files: {
      'dest': ['components/**/*.html', 'view/**/*.html'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  ensure_id: {
    options: {
      elements : ['button', 'a'],
      attrs : ['ng-click']
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
