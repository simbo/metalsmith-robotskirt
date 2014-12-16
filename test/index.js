
var equal = require('assert-dir-equal');
var Metalsmith = require('metalsmith');
var robotskirt = require('..');

describe('metalsmith-robotskirt', function() {

    it('should convert markdown to html', function(done) {
        Metalsmith('test/fixtures/basic')
            .use(robotskirt())
            .build(function(err) {
                if (err) return done(err);
                equal('test/fixtures/basic/expected', 'test/fixtures/basic/build');
                done();
            });
    });

    it('should support all Robotskirt/Sundown extensions', function(done) {
        Metalsmith('test/fixtures/extensions')
            .use(robotskirt({
                extensions: {
                    autolink: true,
                    fenced_code: true,
                    lax_spacing: true,
                    no_intra_emphasis: true,
                    space_headers: true,
                    strikethrough: true,
                    superscript: true,
                    tables: true
                }
            }))
            .build(function(err) {
                if (err) return done(err);
                equal('test/fixtures/extensions/expected', 'test/fixtures/extensions/build');
                done();
            });
    });

    it('should support the Robotskirt/Sundown html flag SKIP_HTML', function(done) {
        Metalsmith('test/fixtures/skip_html')
            .use(robotskirt({
                htmlFlags: {
                    skip_html: true
                }
            }))
            .build(function(err) {
                if (err) return done(err);
                equal('test/fixtures/skip_html/expected', 'test/fixtures/skip_html/build');
                done();
            });
    });

    it('should support the Robotskirt/Sundown html flags SKIP_IMAGES, SKIP_LINKS, SKIP_STYLE and HARD_WRAP', function(done) {
        Metalsmith('test/fixtures/htmlflags')
            .use(robotskirt({
                htmlFlags: {
                    skip_images: true,
                    skip_links: true,
                    skip_style: true,
                    hard_wrap: true
                }
            }))
            .build(function(err) {
                if (err) return done(err);
                equal('test/fixtures/htmlflags/expected', 'test/fixtures/htmlflags/build');
                done();
            });
    });

    it('should support the Robotskirt/Sundown html flags SAFELINK, TOC and USE_XHTML', function(done) {
        Metalsmith('test/fixtures/htmlflags2')
            .use(robotskirt({
                htmlFlags: {
                    safelink: true,
                    toc: true,
                    use_xhtml: true
                }
            }))
            .build(function(err) {
                if (err) return done(err);
                equal('test/fixtures/htmlflags2/expected', 'test/fixtures/htmlflags2/build');
                done();
            });
    });

    it('should highlight code using highlight.js', function(done) {
        Metalsmith('test/fixtures/highlight')
            .use(robotskirt())
            .build(function(err) {
                if (err) return done(err);
                equal('test/fixtures/highlight/expected', 'test/fixtures/highlight/build');
                done();
            });
    });

});
