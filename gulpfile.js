const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const sync = require('browser-sync').create();
const prettify = require('gulp-prettify');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const svgo = require('svgo');

// Configuration object
const config = {
    paths: {
        src: {
            appSass: './src/sass/**/*.scss',
            vendorCSS: './src/css/*.css',
            webfontsSass: './src/webfonts/**/*.scss',
            views: './src/views/pages/*.ejs',
            scripts: ['./src/scripts/**/*.js', 
                      '!./src/scripts/**/thirdparty/**/*.js'], 
            thirdpartyJS: './src/scripts/**/thirdparty/**/*.js',
            apexchartsJS: './node_modules/apexcharts/dist/*.js',
            images: './src/img/**/*.{gif,jpg,png,svg,webp}',
            webfonts: './src/webfonts/**/*.{eot,svg,ttf,woff,woff2}',
            json: './src/json/*.json',
            navigation: './src/navigation.json',
            media: './src/media/**/*.{mp3,mp4,webm,ogg,wav,flac}',
            icons: './src/icons/*.svg'

        },
        dist: {
            appCss: 'dist/css',
            webfontsCss: 'dist/css',
            html: 'dist',
            scripts: './dist/scripts',
            images: './dist/img',
            json: './dist/json',
            webfonts: './dist/webfonts/',
            thirdpartyJS: './dist/scripts/thirdparty',
            navigation: './src/views/partials/generated-navigation.ejs',
            media: './dist/media',
            sprite: './dist/img/sprite.svg'
        },
        watch: {
            appSass: './src/sass/**/*.scss',
            webfontsSass: './src/webfonts/**/*.scss',
            views: ['./src/views/**/*.ejs', './src/views/partials/**/*.ejs'],
            scripts: ['./src/scripts/**/*.js', 
                      '!./src/scripts/_archive/**/*.js'],
            images: './src/img/**/*.{gif,jpg,png,svg,webp}',
            navigation: './src/navigation.json'

        }
    },
    browserSync: {
        baseDir: './dist'
    }
};

// Navigation helpers
const navigationHelpers = {
    isValidHref: (href) => href && href !== '#' && href !== 'javascript:void(0);',
    
    indent: (level) => '    '.repeat(level),
    
    getPageNames: (items) => items
        .filter(item => navigationHelpers.isValidHref(item.href))
        .map(item => path.parse(item.href).name),
        
    getAllPages: (group) => {
        let pages = navigationHelpers.getPageNames(group.items || []);
        (group.items || []).forEach(item => {
            if (item.items) {
                pages = pages.concat(navigationHelpers.getPageNames(item.items));
            }
        });
        return pages;
    },
    
    generateListItem: (item, level, subPages = []) => {
        const lines = [];
        const pageName = navigationHelpers.isValidHref(item.href) ? path.parse(item.href).name : '';
        const indent = navigationHelpers.indent;
        
        if (!item.items && navigationHelpers.isValidHref(item.href)) {
            // Direct link item
            lines.push(`${indent(level)}<li class="<%= currentPage === '${pageName}' ? 'active' : '' %>">`);
            lines.push(`${indent(level + 1)}<a href="${item.href}">`);
            if (item.icon) {
                //lines.push(`${indent(level + 2)}<i class='${item.icon}'></i>`);
                lines.push(`${indent(level + 2)}<svg class="sa-icon"><use href="img/sprite.svg#${item.icon}"></use></svg>`);
            }
            lines.push(`${indent(level + 2)}<span class="nav-link-text" data-i18n="${item.i18n || ''}">${item.text || item.title}</span>`);
            // Add badge if both badgeStyle and badgeText are present
            if (item.badgeStyle && item.badgeText) {
                lines.push(`${indent(level + 2)}<span class="${item.badgeStyle}">${item.badgeText}</span>`);
            }
            if (item.span) {
                lines.push(`${indent(level + 2)}<span class="${item.span.class || ''}">${item.span.text}</span>`);
            }
            lines.push(`${indent(level + 1)}</a>`);
        } else {
            // Parent item or special case
            let listItemClass = '';
            if (item.disabled) {
                listItemClass = 'disabled';
            } else if (item.items) {
                listItemClass = `<%= isInGroup([${subPages.map(p => `'${p}'`).join(', ')}], currentPage) ? 'active' : '' %>`;
            }
            
            lines.push(`${indent(level)}<li${listItemClass ? ` class="${listItemClass}"` : ''}>`);
            lines.push(`${indent(level + 1)}<a href="${item.href || '#'}" title="${item.title}" data-filter-tags="${item.tags || ''}">`);
            if (item.icon) {
                //lines.push(`${indent(level + 2)}<i class="${item.icon}"></i>`);
                lines.push(`${indent(level + 2)}<svg class="sa-icon"><use href="img/sprite.svg#${item.icon}"></use></svg>`);
            }
            lines.push(`${indent(level + 2)}<span class="nav-link-text" data-i18n="${item.i18n || ''}">${item.text || item.title}</span>`);
            
            // Add badge if both badgeStyle and badgeText are present
            if (item.badgeStyle && item.badgeText) {
                lines.push(`${indent(level + 2)}<span class="${item.badgeStyle}">${item.badgeText}</span>`);
            }
            
            if (item.span) {
                lines.push(`${indent(level + 2)}<span class="${item.span.class || ''}">${item.span.text}</span>`);
            }
            
            lines.push(`${indent(level + 1)}</a>`);
        }
        
        return lines;
    }
};

// SVG Sprite Generation
async function generateSprite(cb) {
    try {
        const iconFiles = fs.readdirSync(path.dirname(config.paths.src.icons));
        const svgFiles = iconFiles.filter(file => file.endsWith('.svg'));

        if (svgFiles.length === 0) {
            console.log('No SVG files found in icons directory');
            cb();
            return;
        }

        const symbols = await Promise.all(
            svgFiles.map(async (file) => {
                const filePath = path.join(path.dirname(config.paths.src.icons), file);
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Optimize SVG
                const optimizedSvg = svgo.optimize(content, {
                    plugins: [
                        'removeDoctype',
                        'removeXMLProcInst',
                        'removeComments',
                        'removeMetadata',
                        'removeEditorsNSData',
                        'cleanupAttrs',
                        'removeEmptyAttrs',
                        'removeEmptyContainers',
                    ],
                });

                // Load optimized SVG into cheerio
                const $ = cheerio.load(optimizedSvg.data, { xmlMode: true });
                const svg = $('svg');
                
                // Get viewBox
                const viewBox = svg.attr('viewBox') || '0 0 24 24';
                
                // Create symbol ID from filename
                const id = path.basename(file, '.svg');
                
                // Convert SVG to symbol
                return `<symbol id="${id}" viewBox="${viewBox}">
                    ${svg.html()}
                </symbol>`;
            })
        );

        // Create sprite SVG
        const spriteContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
    ${symbols.join('\n    ')}
</svg>`;

        // Ensure directory exists
        const spriteDir = path.dirname(config.paths.dist.sprite);
        if (!fs.existsSync(spriteDir)) {
            fs.mkdirSync(spriteDir, { recursive: true });
        }

        // Write sprite file
        fs.writeFileSync(config.paths.dist.sprite, spriteContent);
        console.log(`✓ Sprite generated successfully with ${svgFiles.length} icons`);
    } catch (error) {
        console.error('Error generating sprite:', error);
    }
    
    cb();
}

// Task to generate navigation
function generateNavigation(cb) {
    const { isValidHref, indent, getAllPages, generateListItem } = navigationHelpers;
    
    try {
        if (!fs.existsSync(config.paths.src.navigation)) {
            throw new Error('Navigation config file not found');
        }

        const navigationConfig = JSON.parse(fs.readFileSync(config.paths.src.navigation, 'utf8'));
        if (!navigationConfig.lists?.length) {
            throw new Error('Invalid navigation configuration: lists property is missing or empty');
        }

        const lines = [
            '<%',
            '// Simple function to check if page is in group',
            'function isInGroup(group, currentPage) {',
            '  return group.includes(currentPage);',
            '}',
            '%>',
            '',
            `${indent(0)}<ul id="js-nav-menu" class="nav-menu">`
        ];

        navigationConfig.lists.forEach(group => {
            if (!group.items && !navigationHelpers.isValidHref(group.href)) {
                // Only treat as title if no href and no items
                lines.push('', `${indent(1)}<li class="nav-title"><span>${group.title}</span></li>`);
                return;
            }

            if (navigationHelpers.isValidHref(group.href)) {
                // Direct link group
                const pageName = path.parse(group.href).name;
                lines.push('');
                lines.push(`${indent(1)}<li class="<%= currentPage === '${pageName}' ? 'active' : '' %>">`);
                lines.push(`${indent(2)}<a href="${group.href}">`);
                if (group.icon) {
                    lines.push(`${indent(3)}<svg class="sa-icon"><use href="img/sprite.svg#${group.icon}"></use></svg>`);
                }
                lines.push(`${indent(3)}<span class="nav-link-text">${group.title}</span>`);
                // Add badge if both badgeStyle and badgeText are present
                if (group.badgeStyle && group.badgeText) {
                    lines.push(`${indent(3)}<span class="${group.badgeStyle}">${group.badgeText}</span>`);
                }
                lines.push(`${indent(2)}</a>`);
                lines.push(`${indent(1)}</li>`);
            } else if (group.items) {
                // Group with submenu
                const groupPages = getAllPages(group);
                lines.push('');
                lines.push(`${indent(1)}<li class="nav-item <%= isInGroup([${groupPages.map(p => `'${p}'`).join(', ')}], currentPage) ? 'active' : '' %>">`);
                lines.push(`${indent(2)}<a href="#" title="${group.title}" data-filter-tags="${group.tags || ''}">`);
                if (group.icon) {
                    lines.push(`${indent(3)}<svg class="sa-icon"><use href="img/sprite.svg#${group.icon}"></use></svg>`);
                }
                lines.push(`${indent(3)}<span class="nav-link-text" data-i18n="${group.i18n || ''}">${group.text || group.title}</span>`);
                
                // Add badge if both badgeStyle and badgeText are present
                if (group.badgeStyle && group.badgeText) {
                    lines.push(`${indent(3)}<span class="${group.badgeStyle}">${group.badgeText}</span>`);
                }
                
                if (group.span) {
                    lines.push(`${indent(3)}<span class="${group.span.class || ''}">${group.span.text}</span>`);
                }
                
                lines.push(`${indent(2)}</a>`, '', `${indent(2)}<ul>`);

                group.items.forEach(item => {
                    const subPages = item.items ? navigationHelpers.getPageNames(item.items) : [];
                    lines.push(...generateListItem(item, 3, subPages));

                    if (item.items) {
                        lines.push('', `${indent(4)}<ul>`);
                        item.items.forEach(subItem => {
                            lines.push(...generateListItem(subItem, 5));
                            lines.push(`${indent(5)}</li>`);
                        });
                        lines.push(`${indent(4)}</ul>`, '');
                    }
                    
                    lines.push(`${indent(3)}</li>`);
                });
                
                lines.push(`${indent(2)}</ul>`, `${indent(1)}</li>`);
            }
        });

        lines.push(`${indent(0)}</ul>`, '');

        const dirname = path.dirname(config.paths.dist.navigation);
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname, { recursive: true });
        }

        fs.writeFileSync(config.paths.dist.navigation, lines.join('\n'));
    } catch (error) {
        console.error('Error generating navigation:', error.message);
    }
    
    cb();
}

// Separate CSS generation tasks
function generateAppCSS() {
    return src(config.paths.src.appSass)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(rename(function(path) {
            // Remove all directory paths, just keep filename
            path.dirname = "";
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(config.paths.dist.appCss))
        .pipe(sync.stream());
}

function generateWebfontsCSS() {
    return src(config.paths.src.webfontsSass)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(rename(function(path) {
            // Remove all directory paths, just keep filename
            path.dirname = "";
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(config.paths.dist.webfontsCss))
        .pipe(sync.stream());
}

function generateHTML() {
    return src(config.paths.src.views)
        .pipe(ejs())
        .pipe(prettify({ indent_size: 4 }))
        .pipe(rename({ extname: '.html' }))
        .pipe(dest(config.paths.dist.html));
}

function generateJS() {
    return src(config.paths.src.scripts)
        .pipe(rename(function(path) {
            // Remove all directory paths, just keep filename
            path.dirname = "";
        }))
        .pipe(babel())
        .pipe(dest(config.paths.dist.scripts))
        .pipe(uglify())
        .pipe(rename({ extname: '.min.js' }))
        .pipe(dest(config.paths.dist.scripts));
}

function copyImages() {
    return src(config.paths.src.images, { encoding: false })
        .pipe(rename(function(path) {
            // Remove all directory paths, just keep filename
            path.dirname = "";
        }))
        .pipe(dest(config.paths.dist.images));
}

function thirdpartyJS() {
    return src(config.paths.src.thirdpartyJS, { encoding: false })
        .pipe(rename(function(path) {
            // Keep the library structure but remove the path leading to thirdparty
            // Example: src/scripts/optional/thirdparty/apexcharts/apexcharts.js -> apexcharts/apexcharts.js
            const pathParts = path.dirname.split(/[\/\\]/); // Handle both Unix and Windows paths
            const thirdPartyIndex = pathParts.findIndex(part => part === 'thirdparty');
            
            if (thirdPartyIndex !== -1) {
                // Keep just the part after thirdparty directory
                path.dirname = pathParts.slice(thirdPartyIndex + 1).join('/');
            }
        }))
        .pipe(dest(config.paths.dist.thirdpartyJS));
}

function copyMedia() {
    return src(config.paths.src.media, { encoding: false })
        .pipe(dest(config.paths.dist.media));    
}

function copyJSON() {
    return src(config.paths.src.json, { encoding: false })
        .pipe(dest(config.paths.dist.json));
}

function copyVendorCSS() {
    return src(config.paths.src.vendorCSS,)
        .pipe(dest(config.paths.dist.appCss));    
}

function copyWebfonts() {
    return src(config.paths.src.webfonts, { encoding: false })
        .pipe(rename(function(path) {
            // Remove all directory paths, just keep filename
            path.dirname = "";
        }))
        .pipe(dest(config.paths.dist.webfonts));    
}

// Watch task that integrates with BrowserSync
function watchAndSync() {
    // Initialize BrowserSync
    sync.init({
        server: {
            baseDir: config.browserSync.baseDir
        },
        notify: false
    });

    const { watch: watchPaths } = config.paths;
    
    // Set up all watchers
    watch(watchPaths.navigation, generateNavigation);
    watch(watchPaths.views, series(generateHTML, (done) => {
        sync.reload();
        done();
    }));
    watch(watchPaths.appSass, generateAppCSS);
    watch(watchPaths.webfontsSass, generateWebfontsCSS);
    watch(watchPaths.scripts, series(generateJS, (done) => {
        sync.reload();
        done();
    }));
    watch(watchPaths.images, series(copyImages, (done) => {
        sync.reload();
        done();
    }));
}

// Initial build task
const build = series(
    generateNavigation,
    parallel(
        generateAppCSS,
        generateWebfontsCSS,
        generateHTML,
        generateJS,
        copyImages,
        thirdpartyJS,
        copyWebfonts,
        copyMedia,
        copyVendorCSS,
        generateSprite,
        copyJSON
    )
);


// Exports
exports.js = generateJS;
exports.appCss = generateAppCSS;
exports.webfontsCss = generateWebfontsCSS;
exports.html = generateHTML;
exports.navigation = generateNavigation;
exports.sprite = generateSprite;
exports.build = build;

// Default task - now uses the combined watch and sync function
exports.default = series(build, watchAndSync);