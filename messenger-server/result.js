class Result {
    constructor(status, error) {
        this.status = status;
        this.error = error;
    }
}

const results = [
    new Result(0, null),
    new Result(1, "User has not authorized"),
    new Result(-1, "Account ID or password is not correct"),
    new Result(2, "Internal error"),
    new Result(3, "Username is registered!"),
    new Result(4, "Email is registered!")
]

function getResultByStatus(status) {
    return results.filter(result => result.status === status)[0];
};

exports.getResultByStatus = getResultByStatus;
