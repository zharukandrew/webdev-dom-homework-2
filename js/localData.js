let comments = {
    commentsArr: [],
    get: function () {
        return this.commentsArr
    },
    set: function (newValue) {
        this.commentsArr = newValue
    },
};

export { comments }