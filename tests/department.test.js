const { test, expect } = require('@jest/globals');
const Department = require('../actions/department');

test("Can set dept_name via constructor", () => {
    const testValue = "Human Resources";
    const e = new Department("Test", testValue);
    expect(e.dept_name).toBe(testValue);
});

test("getRole() should return \"Department\"", () => {
    const testValue = "Department";
    const e = new Department(11, "Human Resources");
    expect(e.getRole()).toBe(testValue);
});

test("Can get Department Name via getDepartmentName()", () => {
    const testValue = "Human Resources";
    const e = new Department(11, "Human Resources");
    expect(e.getDepartmentName()).toBe(testValue);
});