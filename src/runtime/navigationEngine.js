export default class NavigationEngine {

    constructor(course) {

        this.course = course;
        this.currentPage = 0;

    }

    current() {

        return this.course.pages[this.currentPage];

    }

    next() {

        if (this.currentPage < this.course.pages.length - 1) {
            this.currentPage++;
        }

        return this.current();

    }

    previous() {

        if (this.currentPage > 0) {
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

}