metalsmith-robotskirt
=====================

  > A [Metalsmith](https://github.com/segmentio/metalsmith) plugin to convert
  > markdown files with [Robotskirt](https://github.com/benmills/robotskirt),
  > a node wrapper for [Sundown](https://github.com/vmg/sundown).

[![npm Package Version](https://img.shields.io/npm/v/metalsmith-robotskirt.svg?style=flat-square)](https://www.npmjs.com/package/metalsmith-robotskirt)
[![MIT License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://simbo.mit-license.org)
[![Dependencies Status](https://img.shields.io/david/simbo/metalsmith-robotskirt.svg?style=flat-square)](https://david-dm.org/simbo/metalsmith-robotskirt)
[![devDependencies Status](https://img.shields.io/david/dev/simbo/metalsmith-robotskirt.svg?style=flat-square)](https://david-dm.org/simbo/metalsmith-robotskirt#info=devDependencies)
[![Travis Build Status](https://img.shields.io/travis/simbo/metalsmith-robotskirt/master.svg?style=flat-square)](https://travis-ci.org/simbo/metalsmith-robotskirt)
[![Code Climate GPA](https://img.shields.io/codeclimate/github/simbo/metalsmith-robotskirt.svg?style=flat-square)](https://codeclimate.com/github/simbo/metalsmith-robotskirt)


## Installation

``` sh
$ npm install metalsmith-robotskirt
```


## CLI Usage

Install via npm and then add the metalsmith-robotskirt key to your
_metalsmith.json_ with any options you want, like so:

``` json
{
  "plugins": {
    "metalsmith-robotskirt": {
      "smartypants": true,
      "extensions": {
        "tables": true
      }
    }
  }
}
```


## Javascript Usage

Pass options to the plugin and pass it to Metalsmith with the use method:

``` javascript
var robotskirt = require('metalsmith-robotskirt');

metalsmith.use(robotskirt({
    smartypants: true,
    extensions: {
        tables: true
    }
}));
```


## Options

All options are optional...


### Defaults

``` javascript
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
```


### Extensions

  - `autolink`  
    Parse links even when they are not enclosed in `<>` characters. Autolinks
    for the http, https and ftp protocols will be automatically detected. Email 
    addresses are also handled, and http links without protocol, but starting
    with `www.`

  - `fenced_code`  
    Parse fenced code blocks, PHP-Markdown style. Blocks delimited with 3 or 
    more `~` or backticks will be considered as code, without the need to be
    indented. An optional language name may be added at the end of the opening
    fence for the code block

  - `lax_spacing`  
    HTML blocks do not require to be surrounded by an empty line as in the
    Markdown standard.

  - `no_intra_emphasis`  
    Do not parse emphasis inside of words. Strings such as `foo_bar_baz` will
    not generate `<em>` tags.

  - `space_headers`  
    A space is always required between the hash at the beginning of a header and
    its name, e.g. `#this is my header` would not be a valid header.

  - `strikethrough`  
    Parse strikethrough, PHP-Markdown style. Two `~` characters mark the start
    of a strikethrough, e.g. `this is ~~good~~ bad`

  - `superscript`  
    Parse superscripts after the `^` character; contiguous superscripts are
    nested together, and complex values can be enclosed in parenthesis, e.g.
    `this is the 2^(nd) time`

  - `tables`  
    Parse tables, PHP-Markdown style


### HTML Flags

  - `skip_html`  
    Do not allow any user-inputted HTML in the output.

  - `skip_images`  
    Do not generate any `<img>` tags.

  - `skip_links`  
    Do not generate any `<a>` tags.

  - `skip_style`  
    Do not generate any `<style>` tags.

  - `safelink`  
    Only generate links for protocols which are considered safe.

  - `toc`  
    Add HTML anchors to each header in the output HTML, to allow linking to each
    section.

  - `hard_wrap`
    Insert HTML `<br>` tags inside on paragraphs where the origin Markdown
    document had newlines (by default, Markdown ignores these newlines).

  - `use_xhtml`
    Output XHTML-conformant tags.

  - `expand_tabs`

  - `escape`


### Renderers

You can define your own renderers like this:

``` javascript
var robotskirt = require('metalsmith-robotskirt'),
    highlightjs = require('highlight.js');

function highlight(code, lang) {
    var validLang = lang && highlightjs.getLanguage(lang.trim()),
        highlightedCode = validLang ? highlightjs.highlight(lang, code).value : highlightjs.highlightAuto(code).value,
        langClass = validLang ? ' class="lang-' + lang + '"' : '';
    return '<pre><code' + langClass + '>' + highlightedCode + '</code></pre>';
}

metalsmith.use(robotskirt({
    renderers: {
        blockcode: highlight
    }
}));
```
