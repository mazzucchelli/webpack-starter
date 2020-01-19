/* eslint-disable */

const fs = require('fs');
const handlebars = require('handlebars');
const marked = require('marked');
const path = require('path');
const format = require('string-template');
const hljs = require('highlight.js');
const configs = require('./project.config.json');

const renderer = new marked.Renderer();

// Prevents Marked from adding an ID to headings
renderer.heading = function(text, level) {
    switch (level) {
        case 1:
            return format(`<h{1} class="sg_page-title">{0}</h{1}>`, [text, level]);
        case 2:
            return format(`<h{1} id="${text.toLowerCase().replace(' ', '-')}" class="sg_section-title">{0}</h{1}>`, [text, level]);
        default:
            return format('<h{1}>{0}</h{1}>', [text, level]);
    }
};

// Allows for the creation of HTML examples and live code in one snippet
renderer.code = (code, language) => {
    let extraOutput = '';

    if (typeof language === 'undefined') language = 'html';

    // If the language is *_example, live code will print out along with the sample
    if (language.match(/_example$/)) {
        extraOutput = format('\n\n<div class="sg_content-preview">{0}</div>', [code]);
        language = language.replace(/_example$/, '');
    }

    const renderedCode = hljs.highlight(language, code).value;
    const output = format(
        `
        <div class="sg_content-code">
            <pre>
                <code class="{0}">{1}</code>
                <button class="sg_cpbtn btn">Copy</button>
            </pre>
        </div>`,
        [language, renderedCode],
    );

    return output + extraOutput;
};

const pageslist = () => {
    return configs.styleguide.src.map(el => {
        const filename = el.substr(el.lastIndexOf('/') + 1);
        return {
            label: filename,
            href: `${filename}.html`,
        };
    });
};

const processSectionsArray = arr => {
    return arr.map(function(section, i) {
        // Convert Markdown to HTML
        const body = marked(section, { renderer: renderer });

        // Find the title of the section by identifying the <h2>
        // The second match is the inner group
        const foundHeadings = body.match('<h2.*>(.*)</h2>');
        const title = foundHeadings && foundHeadings[1] ? foundHeadings[1] : 'Section ' + (i + 1);
        const anchor = title.toLowerCase().replace(/[^\w]+/g, '-');
        return { title: title, anchor: anchor, body: body };
    });
};

const styleguide = (input, options, cb) => {
    // Read input file
    const inputFile = fs.readFileSync(path.join(process.cwd(), input));

    // The divider for sections is four newlines
    const sectionsArray = inputFile
        .toString()
        .replace(/(?:\r\n)/gm, '\n')
        .split('\n\n\n\n');

    // Process each page
    const sections = processSectionsArray(sectionsArray);

    // Write file to disk
    const templateFile = fs.readFileSync(path.join(process.cwd(), options.template));
    const template = handlebars.compile(templateFile.toString(), { noEscape: true });
    const outputPath = path.join(process.cwd(), options.output);

    fs.writeFile(
        outputPath,
        template({
            sections: sections,
            pages: pageslist(),
        }),
        cb,
    );
};

configs.styleguide.src.forEach(kitPath => {
    const uikit = path.basename(kitPath);
    const uikitPath = path.dirname(kitPath);

    styleguide(
        `${uikitPath}/${uikit}.md`,
        {
            output: `${configs.styleguide.dest}/${uikit}.html`,
            template: configs.styleguide.template,
        },
        () => console.log(`File ${configs.styleguide.dest}/${uikit}.html created`),
    );
});
