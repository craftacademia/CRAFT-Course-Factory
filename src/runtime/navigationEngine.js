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

    }

    current() {

        return this.course.pages[this.currentPage] ?? null;

    }

    currentIndex() {

        return this.currentPage;

    }

    totalPages() {

        return this.course.pages.length;

    }

    hasNext() {

        return this.currentPage < this.course.pages.length - 1;

    }

    hasPrevious() {

        return this.currentPage > 0;

    }

    next() {

        if (this.hasNext()) {
            this.currentPage++;
        }

        return this.current();

    }

    previous() {

        if (this.hasPrevious()) {
            this.currentPage--;
        }

        return this.current();

    }

    first() {

        this.currentPage = 0;

        return this.current();

    }

    last() {

        this.currentPage = this.course.pages.length - 1;

        return this.current();

    }

    goTo(index) {

        if (!Number.isInteger(index)) {
            throw new Error("Page index must be an integer.");
        }

        if (index < 0 || index >= this.course.pages.length) {
            throw new Error("Page index out of range.");
        }

        this.currentPage = index;

        return this.current();

    }

    reset() {

        this.currentPage = 0;

    }

}