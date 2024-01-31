let comments = {
    commentsArr: [],
    get: function () {
        return this.commentsArr
    },
    set: function (newValue) {
        this.commentsArr = newValue
    },
    delete: function () {
        this.commentsArr.pop()
    }
};

export { comments }