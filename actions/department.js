const References = require('./references');

class Department extends References {
    constructor(dept_id, dept_name) {
        super(dept_id);
        this.dept_name = dept_name;
    }
    getDepartmentName() {
        return this.dept_name;
    }
    getRole() {
        return "Department"
    }
}

module.exports = Department;