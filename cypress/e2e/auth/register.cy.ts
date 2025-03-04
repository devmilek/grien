describe("User Registration", () => {
  it("should register a new user", () => {
    cy.visit("/rejestracja");

    // Fill in the form
    cy.get('input[name="name"]').type("John Due");
    cy.get('input[name="email"]').type("john@email.com");
    cy.get('input[name="password"]').type("password");
  });
});
