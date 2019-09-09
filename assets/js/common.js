//The build will inline common dependencies in this file.

requirejs.config({
    baseUrl: _baseUrl+'/assets/js',
    paths: {
        'app':'./app',
        'mixins':'./lib/mixins',
        'handlebars':'./lib/handlebars.min',
        'text':'./lib/text'
    },
    shim: {

    },
    inlineText: false
});
