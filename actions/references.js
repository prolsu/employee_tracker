class References {
    constructor(dept_id, role_id, manager_id) {
        this.dept_id = dept_id;
        this.role_id = role_id;
        this.manager_id = manager_id;
    }

    getDeptId() {
        return this.dept_id;
    }
    getRoleId() {
        return this.role_id;
    }
    getManagerId() {
        return this.manager_id;
    }
    getRole() {
        return "References"
    }
}

module.exports = References;