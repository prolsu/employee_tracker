const References = require('./references');

class Employee extends References {
    constructor(first_name, last_name, role_id, manager_id) {
        this.first_name = first_name;
        this.last_name = last_name;
        super(role_id, manager_id);
    }

    getFirstName() {
        return this.first_name;
    }
    getLastName() {
        return this.last_name;
    }
    getRole() {
        return "Employee";
    }
}

module.exports = Employee;