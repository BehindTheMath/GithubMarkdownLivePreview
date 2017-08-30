# Github Markdown Live Preview
Github Markdown Live Preview is a Chrome extension which shows a live preview of the rendered Markdown on Github.

Github by itself does not show the rendered Markdown until you click the Preview tab.
This extension displays it as you type, after a 1 second delay.
The output is also sanitized, to protect from XSS attacks.

##### Supported pages
* New and edit issue
* New and edit Wiki page
* New and edit PR

##### Unsupported pages
* New and edit files

## Installation
* Install from the [Chrome Web Store]().

* Install as an unpacked extension:

    1. Clone the repo.
    2. Run `npm install`
    3. Install in Chrome as an unpacked extension from the `src` folder

## Build
```
// Set up the environment
npm install

// Zip up for deployment
npm run zip
```

## Credits
[Showdown](https://github.com/showdownjs/showdown) - a Markdown to HTML converter

[sanitize-html](https://github.com/punkave/sanitize-html) - an HTML sanitizer

## License
MIT License

Copyright (c) 2017 Behind The Math

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.