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

        previewContentElement.innerHTML = textAreaValue ? converter.makeHtml(textAreaValue) : "Nothing to preview";
    }
}
