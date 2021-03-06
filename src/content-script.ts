import sanitizeHtml from "sanitize-html";
import showdown from "showdown";

namespace GithubMarkdownLivePreview {
    const converter: showdown.Converter = new showdown.Converter();
    let timeoutId: number;
    const validPathsRegExp: RegExp = new RegExp(`^\/[^\/]+\/[^\/]+\/(?:issues\/(?:new|\\d+)|wiki\/(?:.+\/_edit|_new)|pull\/\\d+|compare\/.+)$`);

    if (validPathsRegExp.test(document.location.pathname)) {
        // Set listener to run setup on pjax load
        document.addEventListener("pjax:end", setup);

        // Setup on initial page load
        setup();
    }

    function setup(): void {
        const pathname: string = document.location.pathname;

        const newIssuePathRegExp: RegExp = new RegExp(`^\/[^\/]+\/[^\/]+\/issues\/new$`);
        const newPullRequestPathRegExp: RegExp = new RegExp(`^\/[^\/]+\/[^\/]+\/compare\/.+`);
        const newWikiPagePathRegExp: RegExp = new RegExp(`^\/[^\/]+\/[^\/]+\/wiki\/_new$`);
        const editWikiPagePathRegExp: RegExp = new RegExp(`^\/[^\/]+\/[^\/]+\/wiki\/.+\/_edit$`);
        const issuePathRegExp: RegExp = new RegExp(`^\/[^\/]+\/[^\/]+\/issues\/\\d+$`);
        const pullRequestPathRegExp: RegExp = new RegExp(`^\/[^\/]+\/[^\/]+\/pull\/\\d+$`);

        switch (true) {
            case newIssuePathRegExp.test(pathname):
            case newPullRequestPathRegExp.test(pathname):
                (() => {
                    const textAreaElement: HTMLTextAreaElement = document.querySelector("textarea");
                    const previewContentElement: Element = document.querySelector(".js-preview-body");

                    let path: string = document.location.pathname;
                    if (newPullRequestPathRegExp.test(path)) path = path.match(/.*\/compare/)[0];

                    render(getExistingDataFromSessionStorage(path), previewContentElement);
                    setupEventListeners(textAreaElement, previewContentElement);
                })();
                break;
            case newWikiPagePathRegExp.test(pathname):
            case editWikiPagePathRegExp.test(pathname):
                (() => {
                    const textAreaElement: HTMLTextAreaElement = document.querySelector("textarea");
                    const previewContentElement: Element = document.querySelector(".js-preview-body");

                    if (editWikiPagePathRegExp.test(pathname)) {
                        render(textAreaElement.value, previewContentElement);
                    }

                    setupEventListeners(textAreaElement, previewContentElement);
                })();
                break;
            case issuePathRegExp.test(pathname):
            case pullRequestPathRegExp.test(pathname):
                const newCommentTextAreaElement: HTMLTextAreaElement = document.querySelector("form.js-new-comment-form textarea#new_comment_field") as HTMLTextAreaElement;
                const newCommentPreviewContentElement: Element = document.querySelector("form.js-new-comment-form div.js-preview-body");

                // Render existing data from the new comment section
                render(getExistingDataFromSessionStorage(document.location.pathname), newCommentPreviewContentElement);

                // Set up event listeners for the new comment section
                setupEventListeners(newCommentTextAreaElement, newCommentPreviewContentElement);

                // Set up event listeners for each edit comment (regular or inline) sections
                const issuePageEditCommentTextAreaQuerySelector: string = "form textarea[id^='issue-']:not([id='merge_message_field'])";
                const pullRequestPageEditCommentTextAreaQuerySelector: string = "form textarea[id^='discussion_']:not([id='merge_message_field'])";
                Array.from(document.querySelectorAll(`${issuePageEditCommentTextAreaQuerySelector}, ${pullRequestPageEditCommentTextAreaQuerySelector}`))
                    .forEach((textAreaElement: HTMLTextAreaElement) =>
                        setupEventListeners(textAreaElement, textAreaElement.closest("form").querySelector(".js-preview-body")));

                // Set up event listeners for each edit comment buttons
                Array.from(document.querySelectorAll("button.js-comment-edit-button"))
                    .forEach((commentEditButton: HTMLButtonElement) => {
                        let rootElement: Element, textAreaElement: HTMLTextAreaElement, previewContentElement: Element;

                        if (issuePathRegExp.test(pathname)) {
                            rootElement = commentEditButton.closest("div[id^='issue-']");
                            textAreaElement = rootElement.querySelector("form textarea") as HTMLTextAreaElement;
                            previewContentElement = rootElement.querySelector("form.js-comment-update div.js-preview-body");

                        } else if (pullRequestPathRegExp.test(pathname)) {
                            rootElement = commentEditButton.closest("div[id^='discussion_']");
                            textAreaElement = rootElement.querySelector("form textarea") as HTMLTextAreaElement;
                            previewContentElement = rootElement.querySelector("form.js-comment-update div.js-preview-body");
                        }

                        commentEditButton.addEventListener("click", () => {
                            render(textAreaElement.value, previewContentElement);
                        });
                    });

                // Set up event listeners for new inline comment section
                Array.from(document.querySelectorAll("form textarea[id^='new_inline_comment_discussion_']:not([id='merge_message_field'])"))
                    .forEach((textAreaElement: HTMLTextAreaElement) =>
                        setupEventListeners(textAreaElement, textAreaElement.closest("form").querySelector(".js-preview-body")));

                break;
        }
    }

    /**
     * Github stores the data from the textarea in session storage, to be able to restore it if the page reloads.
     * This function retrieves it from storage.
     *
     * @param {string} path
     * @returns {string}
     */
    function getExistingDataFromSessionStorage(path: string): string {
        const sessionStorageKey: string = `session-resume:${path}`;
        const sessionStorageData: string = sessionStorage.getItem(sessionStorageKey);
        if (!sessionStorageData) return null;

        const savedTextAreaValue: RegExpMatchArray = sessionStorageData.match(/\[\[".+","(.+)"\]\]/);
        return savedTextAreaValue ? savedTextAreaValue[1].replace(/\\n/g, "\n") : null;
    }

    function setupEventListeners(textAreaElement: HTMLTextAreaElement, previewContentElement: Element): void {
        textAreaElement.addEventListener("input", () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(render, 1000, textAreaElement.value, previewContentElement);
        });
    }

    function render(textAreaValue: string, previewContentElement: Element): void {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }

        if (textAreaValue) {
            const html: string = converter.makeHtml(textAreaValue);

            // Source: https://github.com/jch/html-pipeline/blob/57dd3df78ea822bc8b10602e21c8b653ca0e39ec/lib/html/pipeline/sanitization_filter.rb#L39-L87
            const sanitizeHtmlOptions: sanitizeHtml.IOptions = {
                allowedTags: ["h1", "h2", "h3", "h4", "h5", "h6", "h7", "h8", "br", "b", "i", "strong", "em", "a", "pre",
                    "code", "img", "tt", "div", "ins", "del", "sup", "sub", "p", "ol", "ul", "table", "thead", "tbody",
                    "tfoot", "blockquote", "dl", "dt", "dd", "kbd", "q", "samp", "var", "hr", "ruby", "rt", "rp", "li",
                    "tr", "td", "th", "s", "strike", "summary", "details"],
                allowedAttributes: {
                    a: ["href"],
                    img: ["src", "longdesc"],
                    div: ["itemscope", "itemtype"],
                    blockquote: ["cite"],
                    del: ["cite"],
                    ins: ["cite"],
                    q: ["cite"],
                    "*": [
                        "abbr", "accept", "accept-charset", "accesskey", "action", "align", "alt", "axis", "border",
                        "cellpadding", "cellspacing", "char", "charoff", "charset", "checked", "clear", "cols", "colspan",
                        "color", "compact", "coords", "datetime", "dir", "disabled", "enctype", "for", "frame", "headers",
                        "height", "hreflang", "hspace", "ismap", "label", "lang", "maxlength", "media", "method", "multiple",
                        "name", "nohref", "noshade", "nowrap", "open", "prompt", "readonly", "rel", "rev", "rows", "rowspan",
                        "rules", "scope", "selected", "shape", "size", "span", "start", "summary", "tabindex", "target",
                        "title", "type", "usemap", "valign", "value", "vspace", "width", "itemprop"]
                },
                allowedSchemes: ["http", "https", "mailto", "github-windows", "github-mac"],
                allowedSchemesByTag: {
                    a: ["http", "https", "mailto", "github-windows", "github-mac"],
                    blockquote: ["http", "https"],
                    del: ["http", "https"],
                    ins: ["http", "https"],
                    q: ["http", "https"],
                    img: ["http", "https"],
                },
                allowProtocolRelative: true
            };
            
            const sanitizedHTML: string = sanitizeHtml(html, sanitizeHtmlOptions);
            previewContentElement.innerHTML = sanitizedHTML;
        } else {
            previewContentElement.textContent = "Nothing to preview";
        }
    }
}
