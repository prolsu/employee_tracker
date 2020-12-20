const References = require('./references');

class Role extends References {
    constructor(title, salary, dept_id) {
        this.title = title;
        this.salary = salary;
        super(dept_id)
    }

    getTitle() {
        return this.title;
    }
    getSalary() {
        return this.salary
    }
    getRole() {
        return "Role"
    }
}

module.exports = Role;