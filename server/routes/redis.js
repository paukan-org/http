'use strict';

module.exports = function *(next) {
    console.log(this.params);
     yield next;
};
