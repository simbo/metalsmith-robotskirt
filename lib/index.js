
var _           = require('lodash'),
    path        = require('path'),
    debug       = require('debug')('metalsmith-robotskirt'),
    Robotskirt  = require('robotskirt'),
    highlightjs = require('highlight.js');

/**
 * plugin expose function
 * @param  {object} options custom options
 * @return {function}       plugin function
 */
module.exports = function(options) {

    // default options
    var defaults = {
        extensions: {
            autolink: true,
            fenced_code: true,
            lax_spacing: true,
            no_intra_emphasis: true,
            space_headers: true,
            strikethrough: true,
            superscript: true,
            tables: true
        },
        htmlFlags: {
            skip_html: false,
            skip_style: false,
            skip_images: false,
            skip_links: false,
            safelink: false,
            toc: false,
            hard_wrap: false,
            use_xhtml: false,
            expand_tabs: false,
            escape: false
        },
        renderers: {
            blockcode: highlightCodeBlocks
        },
        smartypants: true
    };

    // create new object from merged options
    options = _.merge({}, defaults, options);

    // create robotskirt instances
    var renderFunctions = validateRenderFunctions(options.renderers),
        renderer = new Robotskirt.HtmlRenderer(convertConfigToRobotskirtFlags(options.htmlFlags, 'HTML'));
    _.forEach(renderFunctions, function(func, key) {
        renderer[key] = func;
    });
    var markdown = new Robotskirt.Markdown(renderer, convertConfigToRobotskirtFlags(options.extensions, 'EXT'));

    // main plugin function
    return function(files, metalsmith, done) {
        setImmediate(done);
        _.forEach(files, function(file, filename) {
            if (!isMarkdownFile(filename)) {
                return;
            }
            var dir = path.dirname(filename),
                html = path.basename(filename, path.extname(filename)) + '.html',
                contents = markdown.render(file.contents.toString());
            if (options.smartypants) {
                contents = Robotskirt.smartypantsHtml(contents);
            }
            file.contents = new Buffer(contents);
            if ('.' !== dir) {
                html = dir + '/' + html;
            }
            delete files[filename];
            files[html] = file;
        });
    };

};

/**
 * checks if given file has a common markdown extension
 * @param  {string}  file filename or path
 * @return {Boolean}      test result
 */
function isMarkdownFile(file){
    return /\.md|\.markdown/.test(path.extname(file)) ? true : false;
}

/**
 * converts configuration object to an array of binary flags for robotskirt
 * @param  {object} configObj plain object
 * @param  {string} prefix    flag prefix
 * @return {array}            flags
 */
function convertConfigToRobotskirtFlags(configObj, prefix) {
    var robotskirtFlags = [];
    prefix = prefix ? prefix + '_' : '';
    _.forEach(configObj, function(value, key) {
        if (value) {
            robotskirtFlags.push(Robotskirt[prefix + key.toUpperCase()]);
        }
    });
    return robotskirtFlags;
}

/**
 * validates configuration object of render functions
 * @param  {object} configObj configuration object
 * @return {object}           validated object
 */
function validateRenderFunctions(configObj) {
    var robotskirtRenderFunctions = {};
    _.forEach(configObj, function(func, key) {
        if (_.isFunction(func)) {
            robotskirtRenderFunctions[key.toLowerCase()] = func;
        }
    });
    return robotskirtRenderFunctions;
}

/**
 * syntax highlighting for codeblocks using highlight.js
 * @param  {string} code content
 * @param  {string} lang language key
 * @return {string}      highlighted content
 */
function highlightCodeBlocks(code, lang) {
    var validLang = lang && highlightjs.getLanguage(lang.trim()),
        highlightedCode = validLang ? highlightjs.highlight(lang, code).value : highlightjs.highlightAuto(code).value,
        langClass = validLang ? ' class="lang-' + lang + '"' : '';
    return '<pre><code' + langClass + '>' + highlightedCode + '</code></pre>';
}
