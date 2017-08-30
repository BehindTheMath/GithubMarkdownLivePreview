namespace GithubMarkdownLivePreview {
    const converter: showdown.Converter = new showdown.Converter();
    let timeoutId: number;

    if (/^\/\w+\/\w+\/(?:issues\/(?:new|\d+)|wiki\/(?:.+\/_edit|_new)|pull\/\d+)$/.test(document.location.pathname)) {
        // Set listener to run setup on pjax load
        document.addEventListener("pjax:end", setup);

        // Setup on initial page load
        setup();
    }

    function setup(): void {
        const path: string = document.location.pathname;
        switch (true) {
            case /^\/\w+\/\w+\/issues\/new$/.test(path):
            case /^\/\w+\/\w+\/compare\/.+/.test(path):
                (() => {
                    const textAreaElement: HTMLTextAreaElement = document.querySelector("textarea");
                    const previewContentElement: Element = document.querySelector(".preview-content");

                    render(getExistingDataFromSessionStorage(), previewContentElement);
                    setupEventListeners(textAreaElement, previewContentElement);
                })();
                break;
            case /^\/\w+\/\w+\/wiki\/_new$/.test(path):
            case /^\/\w+\/\w+\/wiki\/.+\/_edit$/.test(path):
                (() => {
                    const textAreaElement: HTMLTextAreaElement = document.querySelector("textarea");
                    const previewContentElement: Element = document.querySelector(".preview-content");

                    if (/^\/\w+\/\w+\/wiki\/.+\/_edit$/.test(path)) {
                        render(textAreaElement.value, previewContentElement);
                    }

                    setupEventListeners(textAreaElement, previewContentElement);
                })();
                break;
            case /^\/\w+\/\w+\/issues\/\d+$/.test(path):
            case /^\/\w+\/\w+\/pull\/\d+$/.test(path):
                const newCommentTextAreaElement: HTMLTextAreaElement = document.querySelector("form.js-new-comment-form textarea#new_comment_field") as HTMLTextAreaElement;
                const newCommentPreviewContentElement: Element = document.querySelector("form.js-new-comment-form div.preview-content");

                // Render existing data from the new comment section
                render(getExistingDataFromSessionStorage(), newCommentPreviewContentElement);

                // Set up event listeners for the new comment section
                setupEventListeners(newCommentTextAreaElement, newCommentPreviewContentElement);

                // Set up event listeners for each edit comments sections
                Array.from(document.querySelectorAll("form textarea[id^='issue-']:not([id='merge_message_field'])")).forEach((textAreaElement: HTMLTextAreaElement) => {
                    const formElement: Element = textAreaElement.closest("form");
                    const previewContentElement: Element = formElement.querySelector(".preview-content p");

                    setupEventListeners(textAreaElement, previewContentElement);
                });

                // Set up event listeners for each edit comments buttons
                Array.from(document.querySelectorAll("button.js-comment-edit-button")).forEach((commentEditButton: HTMLButtonElement) => {
                    const formElement: Element = commentEditButton.closest("div[id^='issue-']");
                    const textAreaElement = formElement.querySelector("form textarea") as HTMLTextAreaElement;
                    const previewContentElement: Element = formElement.querySelector("form.js-comment-update div.preview-content p");

                    commentEditButton.addEventListener("click", () => {
                        render(textAreaElement.value, previewContentElement);
                    });
                });

                break;
        }
    }

    function getExistingDataFromSessionStorage(): string {
        const sessionStorageKey: string = `session-resume:${document.location.pathname}`;
        const sessionStorageData: string = sessionStorage.getItem(sessionStorageKey);
        return sessionStorageData ? /\[\[".+","(.+)"\]\]/.exec(sessionStorageData)[1] : null;
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

            const sanitizeHtmlOptions: sanitize.IOptions = {
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
