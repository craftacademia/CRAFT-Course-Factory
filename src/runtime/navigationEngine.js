export default class NavigationEngine {

    constructor(course) {

        if (!course) {
            throw new Error("Course is required.");
        }

        if (!Array.isArray(course.pages)) {
            throw new Error("Course pages are required.");
        }

        if (course.pages.length === 0) {
            throw new Error("Course contains no pages.");
        }

        this.course = course;

        this.currentPage = 0;

        this.history = [0];

        this.bookmarks = new Set();

        this.listeners = new Map();

    }


    current() {

        return this.course.pages[this.currentPage] ?? null;

    }


    findPageIndex(pageId) {

        return this.course.pages.findIndex(
            page =>
                page.id === pageId
        );

    }


    goToPage(pageId) {

        const index =
            this.findPageIndex(pageId);


        if (index === -1) {

            throw new Error(
                `Page not found: ${pageId}`
            );

        }


        return this.navigate(index);

    }


    currentIndex() {

        return this.currentPage;

    }


    totalPages() {

        return this.course.pages.length;

    }


    progress() {

        return ((this.currentPage + 1) / this.totalPages()) * 100;

    }


    hasNext() {

        return this.currentPage < this.totalPages() - 1;

    }


    hasPrevious() {

        return this.currentPage > 0;

    }


    on(event, handler) {

        if (!this.listeners.has(event)) {

            this.listeners.set(
                event,
                new Set()
            );

        }

        this.listeners
            .get(event)
            .add(handler);

    }


    emit(event, payload) {

        const handlers =
            this.listeners.get(event);


        if (!handlers) {
            return;
        }


        for (const handler of handlers) {

            handler(payload);

        }

    }


    navigate(index) {

        const previousPage =
            this.currentPage;


        this.emit(
            "beforeNavigate",
            {
                from: previousPage,
                to: index
            }
        );


        this.currentPage = index;

        this.history.push(index);


        this.emit(
            "afterNavigate",
            {
                from: previousPage,
                to: index,
                page: this.current()
            }
        );


        return this.current();

    }


    next() {

        if (this.hasNext()) {

            return this.navigate(
                this.currentPage + 1
            );

        }


        return this.current();

    }


    previous() {

        if (this.hasPrevious()) {

            const prevIndex =
                this.history[this.history.length - 2];
            this.history.splice(-2, 2);
            return this.navigate(prevIndex);
        }


        return this.current();

    }


    goTo(index) {

        if (!Number.isInteger(index)) {

            throw new Error(
                "Page index must be an integer."
            );

        }


        if (
            index < 0 ||
            index >= this.totalPages()
        ) {

            throw new Error(
                "Page index out of range."
            );

        }


        return this.navigate(index);

    }


    bookmark(index = this.currentPage) {

        this.bookmarks.add(index);

    }


    removeBookmark(index) {

        this.bookmarks.delete(index);

    }


    isBookmarked(index = this.currentPage) {

        return this.bookmarks.has(index);

    }


    getBookmarks() {

        return [...this.bookmarks];

    }


    getHistory() {

        return [...this.history];

    }


    serialize() {

        return {

            currentPage: this.currentPage,

            history: this.history,

            bookmarks: [...this.bookmarks]

        };

    }


    restore(state) {

        if (!state) {
            return;
        }


        if (Number.isInteger(state.currentPage)) {

            this.currentPage =
                state.currentPage;

        }

    }


    reset() {

        this.currentPage = 0;

        this.history = [0];

        this.bookmarks.clear();

        this.listeners.clear();

    }

}